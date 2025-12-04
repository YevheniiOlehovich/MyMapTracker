const net = require('net');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// === Settings ===
const HOST = '0.0.0.0';
const PORT = 20120;
const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
const DATABASE_NAME = 'test';

// === Logs ===
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

function logToFile(message) {
  const date = new Date().toISOString().split('T')[0];
  const file = path.join(LOG_DIR, `${date}.log`);
  fs.appendFileSync(file, `[${new Date().toISOString()}] ${message}\n`);
  console.log(message);
}

// === DB ===
const client = new MongoClient(MONGODB_URI);

// === Helpers ===
function cleanImei(imei) {
  return imei.replace(/\D/g, '');
}

function sendConfirmation(socket) {
  socket.write(Buffer.from([0x01]));
}

// === CRC16 Teltonika ===
function crc16_teltonika(buf) {
  let crc = 0x0000;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x0001) ? (crc >>> 1) ^ 0xA001 : crc >>> 1;
    }
  }
  return crc;
}

// === Parse Codec 8 IO ===
function parseCodec8IO(buf, offset) {
  const ioMap = {};
  try {
    const eventId = buf.readUInt8(offset++);
    const totalIO = buf.readUInt8(offset++);

    const readIO = (count, size) => {
      const m = {};
      for (let i = 0; i < count; i++) {
        const id = buf.readUInt8(offset++);
        const v = buf.slice(offset, offset + size);
        offset += size;
        m[id] = { size, value: v.toString('hex') };
      }
      return m;
    };

    let count;
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 1));
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 2));
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 4));
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 8));

    return { ioMap, eventId };
  } catch (e) {
    return { ioMap: {}, eventId: null };
  }
}

// === Decode AVL ===
async function decodeAvlData(buf, imei, db) {
  try {
    const rawHex = buf.toString('hex');
    const len = buf.length;

    // --- Dat_len і виділення AVL ---
    const datLen = buf.readUInt32BE(4);
    const avlStart = 8;
    const avlEnd = avlStart + datLen;
    const avlBuf = buf.slice(avlStart, avlEnd);

    // --- CRC ---
    const crcCalc = crc16_teltonika(avlBuf); // 2 байти CRC16
    const crcPacket = buf.readUInt16BE(buf.length - 2); // останні 2 байти з 4-байтного поля CRC у пакеті
    const crcValidFlag = crcCalc === crcPacket ? 1 : 0;

    // --- Timestamp ---
    const ts = Number(avlBuf.readBigUInt64BE(2)) / 1000;
    const dt = new Date(ts * 1000);

    // --- GPS ---
    const gpsOffset = 11;
    const lng = avlBuf.readInt32BE(gpsOffset) / 1e7;
    const lat = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
    const alt = avlBuf.readInt16BE(gpsOffset + 8);
    const ang = avlBuf.readInt16BE(gpsOffset + 10);
    const sats = avlBuf[gpsOffset + 12];
    const spd = avlBuf.readInt16BE(gpsOffset + 13);

    const { ioMap, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);

    let card_id = null;
    if (ioMap[157] && !/^0+$/.test(ioMap[157].value)) {
      card_id = ioMap[157].value;
    }

    // --- Logging ---
    logToFile(`📅 DATE: ${dt.toISOString()}`);
    logToFile(`📦 RAW HEX (${imei}): ${rawHex}`);
    logToFile(`📏 LENGTH: ${len} bytes`);
    logToFile(`🧩 DECODED (${imei}): lat=${lat} lng=${lng} alt=${alt} speed=${spd} angle=${ang} sats=${sats}`);
    logToFile(`🔧 IO EVENT=${eventId} IO COUNT=${Object.keys(ioMap).length} CARD=${card_id || 'none'}`);
    logToFile(`🔐 CRC: calculated=${crcCalc.toString(16).toLowerCase()} packet=${crcPacket.toString(16).toLowerCase()} VALID=${crcValidFlag}`);

    // --- DB save ---
    const collectionName = `trek_${dt.getFullYear()}`;
    const col = db.collection(collectionName);
    const key = { date: dt.toISOString().split('T')[0], imei };

    const record = {
      timestamp: dt,
      latitude: lat,
      longitude: lng,
      altitude: alt,
      angle: ang,
      satellites: sats,
      speed: spd,
      io: ioMap,
      eventId,
      card_id,
      raw: rawHex,
      crc: {
        calculated: crcCalc.toString(16).toLowerCase(),
        packet: crcPacket.toString(16).toLowerCase(),
        valid: crcValidFlag
      }
    };

    const exists = await col.findOne(key);
    if (!exists) {
      await col.insertOne({ ...key, data: [record] });
    } else {
      await col.updateOne(key, { $push: { data: record } });
    }

    logToFile(`✅ Saved to ${collectionName}`);
  } catch (e) {
    logToFile(`❌ Decode error: ${e.message}`);
  }
}

// === Server start ===
async function start() {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    logToFile(`✅ MongoDB connected`);

    const server = net.createServer(sock => {
      logToFile(`🔌 New client connected: ${sock.remoteAddress}:${sock.remotePort}`);

      let imei = '';

      sock.on('data', async data => {
        if (!imei) {
          logToFile(`📥 FIRST PACKET: ${data.toString('hex')}`);
          imei = cleanImei(data.toString());
          logToFile(`📡 IMEI = ${imei}`);
          sendConfirmation(sock);
          return;
        }

        logToFile(`📥 AVL: ${data.toString('hex')}`);
        await decodeAvlData(data, imei, db);
        sendConfirmation(sock);
      });

      sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
      sock.on('error', err => logToFile(`⚠️ Socket error: ${err.message}`));
    });

    server.listen(PORT, HOST, () =>
      logToFile(`🚀 Listening TCP ${HOST}:${PORT}`)
    );
  } catch (e) {
    logToFile(`💥 Fatal error: ${e.message}`);
  }
}

// start();

// const net = require('net');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');
// const path = require('path');

// // === Налаштування ===
// const HOST = '0.0.0.0';
// const PORT = 20120;
// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';
// const COLLECTION_NAME = 'avl_records';

// // === Папка для логів ===
// const LOG_DIR = path.join(__dirname, 'logs');
// if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// // === Допоміжна функція для запису в лог ===
// function logToFile(message) {
//   const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//   const logFile = path.join(LOG_DIR, `${date}.log`);
//   const timestamp = new Date().toISOString();
//   fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
//   console.log(message);
// }

// // === MongoDB клієнт ===
// const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// // === Старт сервера ===
// async function startServer() {
//   await client.connect();
//   logToFile('✅ Connected to MongoDB');

//   const db = client.db(DATABASE_NAME);
//   const collection = db.collection(COLLECTION_NAME);

//   const server = net.createServer(socket => {
//     logToFile(`🔌 Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

//     let imei = '';

//     socket.once('data', data => {
//       imei = cleanImei(data.toString().trim());
//       logToFile(`📡 Received IMEI: ${imei}`);
//       sendConfirmation(socket);

//       socket.on('data', packet => {
//         const hexString = packet.toString('hex');
//         logToFile(`📦 RAW HEX (${imei}): ${hexString}`); // ✅ повний сирий пакет

//         decodeAvlData(packet, imei, collection);
//         sendConfirmation(socket);
//       });

//       socket.on('close', () => logToFile(`❌ Client disconnected: ${imei}`));
//       socket.on('error', err => logToFile(`⚠️ Socket error: ${err.message}`));
//     });
//   });

//   server.listen(PORT, HOST, () => logToFile(`🚀 Server listening on ${HOST}:${PORT}`));
// }

// // === Допоміжні функції ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // === IO Парсер ===
// function parseCodec8IO(buf, ioOffset) {
//   let offset = ioOffset;
//   const ioMap = {};

//   if (offset >= buf.length) return { ioMap, nextOffset: offset };

//   try {
//     offset += 1; // eventId
//     const totalIO = buf.readUInt8(offset); offset += 1;

//     const readIO = (count, size) => {
//       const map = {};
//       for (let i = 0; i < count; i++) {
//         const id = buf.readUInt8(offset); offset += 1;
//         const valBuf = buf.slice(offset, offset + size); offset += size;
//         map[id] = { size, hex: valBuf.toString('hex') };
//       }
//       return map;
//     };

//     Object.assign(ioMap, readIO(buf.readUInt8(offset++), 1));
//     Object.assign(ioMap, readIO(buf.readUInt8(offset++), 2));
//     Object.assign(ioMap, readIO(buf.readUInt8(offset++), 4));
//     Object.assign(ioMap, readIO(buf.readUInt8(offset++), 8));

//     return { ioMap, nextOffset: offset };
//   } catch {
//     return { ioMap, nextOffset: offset };
//   }
// }

// // === Основна функція розбору AVL ===
// async function decodeAvlData(buffer, imei, collection) {
//   try {
//     if (buffer.length < 34) return logToFile(`⚠️ [${imei}] Packet too short`);

//     const timestamp = Number(buffer.readBigUInt64BE(10)) / 1000;
//     const timestampDate = new Date(timestamp * 1000);
//     const date = timestampDate.toISOString().split('T')[0];

//     const gpsDataOffset = 19;
//     if (buffer.length < gpsDataOffset + 15) return logToFile(`⚠️ [${imei}] Packet too short for GPS`);

//     const longitude = buffer.readInt32BE(gpsDataOffset) / 1e7;
//     const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 1e7;
//     const altitude = buffer.readInt16BE(gpsDataOffset + 8);
//     const angle = buffer.readInt16BE(gpsDataOffset + 10);
//     const satellites = buffer[gpsDataOffset + 12];
//     const speed = buffer.readInt16BE(gpsDataOffset + 13);

//     const ioStartOffset = gpsDataOffset + 15;
//     const { ioMap } = parseCodec8IO(buffer, ioStartOffset);

//     let card_id = null;
//     if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
//       card_id = ioMap[157].hex.toLowerCase();
//     }

//     const dataRecord = { timestamp: timestampDate, longitude, latitude, altitude, angle, satellites, speed, card_id };

//     const query = { date, imei };
//     const existing = await collection.findOne(query);

//     if (existing) {
//       await collection.updateOne(query, { $push: { data: dataRecord } });
//     } else {
//       await collection.insertOne({ date, imei, data: [dataRecord] });
//     }

//     logToFile(`✅ [${imei}] Inserted record. card_id=${card_id || 'none'}`);
//   } catch (err) {
//     logToFile(`❌ [${imei}] Error decoding AVL data: ${err.message}`);
//   }
// }

// startServer().catch(err => logToFile(`💥 Server failed to start: ${err.message}`));
