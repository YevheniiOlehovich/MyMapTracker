// const net = require('net');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');
// const path = require('path');

// // === Settings ===
// const HOST = '0.0.0.0';
// const PORT = 20120;
// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';

// // === Logs ===
// const LOG_DIR = path.join(__dirname, 'logs');
// if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// function logToFile(message) {
//   const date = new Date().toISOString().split('T')[0];
//   const file = path.join(LOG_DIR, `${date}.log`);
//   fs.appendFileSync(file, `[${new Date().toISOString()}] ${message}\n`);
//   console.log(message);
// }

// // === DB ===
// const client = new MongoClient(MONGODB_URI);

// // === Helpers ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // === CRC16 Teltonika ===
// function crc16_teltonika(buf) {
//   let crc = 0x0000;
//   for (let i = 0; i < buf.length; i++) {
//     crc ^= buf[i];
//     for (let j = 0; j < 8; j++) {
//       crc = (crc & 0x0001) ? (crc >>> 1) ^ 0xA001 : crc >>> 1;
//     }
//   }
//   return crc;
// }

// // === Parse Codec 8 IO ===
// function parseCodec8IO(buf, offset) {
//   const ioMap = {};
//   try {
//     const eventId = buf.readUInt8(offset++);
//     const totalIO = buf.readUInt8(offset++);

//     const readIO = (count, size) => {
//       const m = {};
//       for (let i = 0; i < count; i++) {
//         const id = buf.readUInt8(offset++);
//         const v = buf.slice(offset, offset + size);
//         offset += size;
//         m[id] = { size, value: v.toString('hex') };
//       }
//       return m;
//     };

//     let count;
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 1));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 2));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 4));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 8));

//     return { ioMap, eventId };
//   } catch (e) {
//     return { ioMap: {}, eventId: null };
//   }
// }

// // === Decode AVL ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     const rawHex = buf.toString('hex');
//     const len = buf.length;

//     // --- Dat_len і виділення AVL ---
//     const datLen = buf.readUInt32BE(4);
//     const avlStart = 8;
//     const avlEnd = avlStart + datLen;
//     const avlBuf = buf.slice(avlStart, avlEnd);

//     // --- CRC ---
//     const crcCalc = crc16_teltonika(avlBuf); // 2 байти CRC16
//     const crcPacket = buf.readUInt16BE(buf.length - 2); // останні 2 байти з 4-байтного поля CRC у пакеті
//     const crcValidFlag = crcCalc === crcPacket ? 1 : 0;

//     // --- Timestamp ---
//     const ts = Number(avlBuf.readBigUInt64BE(2)) / 1000;
//     const dt = new Date(ts * 1000);

//     // --- GPS ---
//     const gpsOffset = 11;
//     const lng = avlBuf.readInt32BE(gpsOffset) / 1e7;
//     const lat = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
//     const alt = avlBuf.readInt16BE(gpsOffset + 8);
//     const ang = avlBuf.readInt16BE(gpsOffset + 10);
//     const sats = avlBuf[gpsOffset + 12];
//     const spd = avlBuf.readInt16BE(gpsOffset + 13);

//     const { ioMap, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);

//     let card_id = null;
//     if (ioMap[157] && !/^0+$/.test(ioMap[157].value)) {
//       card_id = ioMap[157].value;
//     }

//     // --- Logging ---
//     logToFile(`📅 DATE: ${dt.toISOString()}`);
//     logToFile(`📦 RAW HEX (${imei}): ${rawHex}`);
//     logToFile(`📏 LENGTH: ${len} bytes`);
//     logToFile(`🧩 DECODED (${imei}): lat=${lat} lng=${lng} alt=${alt} speed=${spd} angle=${ang} sats=${sats}`);
//     logToFile(`🔧 IO EVENT=${eventId} IO COUNT=${Object.keys(ioMap).length} CARD=${card_id || 'none'}`);
//     logToFile(`🔐 CRC: calculated=${crcCalc.toString(16).toLowerCase()} packet=${crcPacket.toString(16).toLowerCase()} VALID=${crcValidFlag}`);

//     // --- DB save ---
//     const collectionName = `trek_${dt.getFullYear()}`;
//     const col = db.collection(collectionName);
//     const key = { date: dt.toISOString().split('T')[0], imei };

//     const record = {
//       timestamp: dt,
//       latitude: lat,
//       longitude: lng,
//       altitude: alt,
//       angle: ang,
//       satellites: sats,
//       speed: spd,
//       io: ioMap,
//       eventId,
//       card_id,
//       raw: rawHex,
//       crc: {
//         calculated: crcCalc.toString(16).toLowerCase(),
//         packet: crcPacket.toString(16).toLowerCase(),
//         valid: crcValidFlag
//       }
//     };

//     const exists = await col.findOne(key);
//     if (!exists) {
//       await col.insertOne({ ...key, data: [record] });
//     } else {
//       await col.updateOne(key, { $push: { data: record } });
//     }

//     logToFile(`✅ Saved to ${collectionName}`);
//   } catch (e) {
//     logToFile(`❌ Decode error: ${e.message}`);
//   }
// }

// // === Server start ===
// async function start() {
//   try {
//     await client.connect();
//     const db = client.db(DATABASE_NAME);
//     logToFile(`✅ MongoDB connected`);

//     const server = net.createServer(sock => {
//       logToFile(`🔌 New client connected: ${sock.remoteAddress}:${sock.remotePort}`);

//       let imei = '';

//       sock.on('data', async data => {
//         if (!imei) {
//           logToFile(`📥 FIRST PACKET: ${data.toString('hex')}`);
//           imei = cleanImei(data.toString());
//           logToFile(`📡 IMEI = ${imei}`);
//           sendConfirmation(sock);
//           return;
//         }

//         logToFile(`📥 AVL: ${data.toString('hex')}`);
//         await decodeAvlData(data, imei, db);
//         sendConfirmation(sock);
//       });

//       sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
//       sock.on('error', err => logToFile(`⚠️ Socket error: ${err.message}`));
//     });

//     server.listen(PORT, HOST, () =>
//       logToFile(`🚀 Listening TCP ${HOST}:${PORT}`)
//     );
//   } catch (e) {
//     logToFile(`💥 Fatal error: ${e.message}`);
//   }
// }

// start();


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

    // --- Пакет ---
    const preamble = buf.slice(0, 4).toString('hex');
    const datLenBuf = buf.slice(4, 8);
    const datLen = datLenBuf.readUInt32BE();
    const avlBuf = buf.slice(8, 8 + datLen);
    const crcBuf = buf.slice(8 + datLen, 8 + datLen + 4);

    // --- CRC ---
    const crcCalc = crc16_teltonika(avlBuf);
    const crcPacket = buf.readUInt16BE(buf.length - 2);
    const crcValidFlag = crcCalc === crcPacket ? 1 : 0;

    // --- Codec & Records ---
    const codecId = avlBuf[0];
    const recordsCount = avlBuf[1];
    const recordsHex = [];
    let offset = 2;

    for (let i = 0; i < recordsCount; i++) {
      // Timestamp(8) + Priority(1) + GPS(15)
      if (offset + 24 > avlBuf.length) break;

      const tsHex = avlBuf.slice(offset, offset + 8).toString('hex');
      const ts = Number(avlBuf.readBigUInt64BE(offset)); // дата з трекера
      const dt = new Date(ts); // тут точна дата події
      const priority = avlBuf.slice(offset + 8, offset + 9).toString('hex');
      const gps = avlBuf.slice(offset + 9, offset + 24).toString('hex');

      // IO: все, що залишилось до кінця запису
      let nextRecordOffset = offset + 24;
      if (i < recordsCount - 1) {
        // тимчасово беремо до початку наступного запису
        nextRecordOffset = offset + 24;
      } else {
        nextRecordOffset = avlBuf.length; // останній запис
      }
      const io = avlBuf.slice(offset + 24, nextRecordOffset).toString('hex');

      recordsHex.push({ timestamp: dt.toISOString(), tsHex, priority, gps, io });
      offset = nextRecordOffset;
    }

    // --- Пакет як об’єкт ---
    const packetObj = {
      preamble,
      datLen: datLenBuf.toString('hex'),
      avlBuf: avlBuf.toString('hex'),
      crc: crcBuf.toString('hex'),
      codecId: codecId.toString(16),
      recordsCount,
      records: recordsHex
    };

    logToFile(`📦 PACKET OBJECT (${imei}): ${JSON.stringify(packetObj, null, 2)}`);

    // --- DB save ---
    const collectionName = `trek_${new Date().getFullYear()}`;
    const col = db.collection(collectionName);
    const key = { date: recordsHex[0]?.timestamp.split('T')[0] || new Date().toISOString().split('T')[0], imei };

    const record = {
      raw: rawHex,
      packetObj,
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

start();
