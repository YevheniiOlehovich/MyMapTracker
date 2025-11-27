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

// // === IO parser ===
// function parseCodec8IO(buf, offset) {
//   const ioMap = {};
//   try {
//     offset += 2; // skip eventID + totalIO
//     const readIO = (count, size) => {
//       const m = {};
//       for (let i = 0; i < count; i++) {
//         const id = buf.readUInt8(offset++);
//         const v = buf.slice(offset, offset + size);
//         offset += size;
//         m[id] = { size, hex: v.toString('hex') };
//       }
//       return m;
//     };
//     let count;
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 1));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 2));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 4));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 8));
//   } catch {}
//   return { ioMap };
// }

// // === Decode AVL ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     if (buf.length < 34) {
//       logToFile(`⚠️ Packet too short (${buf.length} bytes) from ${imei}`);
//       return;
//     }

//     const raw_hex = buf.toString('hex');
//     logToFile(`📦 RAW HEX (${imei}): ${raw_hex}`);
//     logToFile(`📏 Packet length: ${buf.length} bytes`);

//     // === GPS parsing ===
//     const gpsOffset = 19;
//     if (buf.length < gpsOffset + 15) {
//       logToFile(`⚠️ Packet too short for GPS parsing: ${buf.length} bytes`);
//       return;
//     }

//     const ts = Number(buf.readBigUInt64BE(10)) / 1000;
//     const dt = new Date(ts * 1000);
//     const date = dt.toISOString().split('T')[0];
//     const year = dt.getFullYear();

//     const lng = buf.readInt32BE(gpsOffset) / 1e7;
//     const lat = buf.readInt32BE(gpsOffset + 4) / 1e7;
//     const alt = buf.readInt16BE(gpsOffset + 8);
//     const ang = buf.readInt16BE(gpsOffset + 10);
//     const sats = buf[gpsOffset + 12];
//     const spd = buf.readInt16BE(gpsOffset + 13);

//     const ioOffset = gpsOffset + 15;
//     const { ioMap } = parseCodec8IO(buf, ioOffset);

//     let card_id = null;
//     if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
//       card_id = ioMap[157].hex.toLowerCase();
//     }

//     const record = {
//       timestamp: dt,
//       longitude: lng,
//       latitude: lat,
//       altitude: alt,
//       angle: ang,
//       satellites: sats,
//       speed: spd,
//       card_id,
//       raw_hex
//     };

//     const collectionName = `trek_${year}`;
//     const col = db.collection(collectionName);

//     const q = { date, imei };
//     logToFile(`🔍 Query: ${JSON.stringify(q)}`);

//     const exists = await col.findOne(q);
//     if (exists) {
//       await col.updateOne(q, { $push: { data: record } });
//     } else {
//       await col.insertOne({ date, imei, data: [record] });
//     }

//     logToFile(`✅ [${imei}] Saved to ${collectionName} card=${card_id || 'none'}`);

//   } catch (e) {
//     logToFile(`❌ Decode error [${imei}]: ${e.message}`);
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
//         try {
//           // перший пакет IMEI
//           if (!imei) {
//             logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
//             imei = cleanImei(data.toString());
//             logToFile(`📡 IMEI parsed: ${imei}`);
//             sendConfirmation(sock);
//             return;
//           }

//           // усі наступні пакети AVL
//           logToFile(`📥 AVL PACKET RAW (${imei}): ${data.toString('hex')}`);
//           logToFile(`📏 Packet length: ${data.length} bytes`);

//           await decodeAvlData(data, imei, db);
//           sendConfirmation(sock);

//         } catch (err) {
//           logToFile(`❌ Socket data handler error: ${err.message}`);
//         }
//       });

//       sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
//       sock.on('error', e => logToFile(`⚠️ Socket error: ${e.message}`));
//     });

//     server.listen(PORT, HOST, () =>
//       logToFile(`🚀 Listening TCP ${HOST}:${PORT}`)
//     );

//   } catch (e) {
//     logToFile(`💥 Fatal: ${e.message}`);
//   }
// }

// start();


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

// // === IO parser ===
// function parseCodec8IO(buf, offset) {
//   const ioMap = {};
//   try {
//     offset += 2; // skip eventID + totalIO
//     const readIO = (count, size) => {
//       const m = {};
//       for (let i = 0; i < count; i++) {
//         const id = buf.readUInt8(offset++);
//         const v = buf.slice(offset, offset + size);
//         offset += size;
//         m[id] = { size, hex: v.toString('hex') };
//       }
//       return m;
//     };
//     let count;
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 1));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 2));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 4));
//     count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 8));
//   } catch (e) {
//     logToFile(`⚠️ IO parse error: ${e.message}`);
//   }
//   return { ioMap };
// }

// // === Decode AVL ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     if (buf.length < 34) {
//       logToFile(`⚠️ Packet too short (${buf.length} bytes) from ${imei}`);
//       return;
//     }

//     const raw_hex = buf.toString('hex');
//     logToFile(`📦 RAW HEX (${imei}): ${raw_hex}`);
//     logToFile(`📏 Packet length: ${buf.length} bytes`);

//     // === GPS parsing ===
//     const gpsOffset = 19;
//     if (buf.length < gpsOffset + 15) {
//       logToFile(`⚠️ Packet too short for GPS parsing: ${buf.length} bytes`);
//       return;
//     }

//     const ts = Number(buf.readBigUInt64BE(10)) / 1000;
//     const dt = new Date(ts * 1000);
//     const date = dt.toISOString().split('T')[0];
//     const year = dt.getFullYear();

//     const lng = buf.readInt32BE(gpsOffset) / 1e7;
//     const lat = buf.readInt32BE(gpsOffset + 4) / 1e7;
//     const alt = buf.readInt16BE(gpsOffset + 8);
//     const ang = buf.readInt16BE(gpsOffset + 10);
//     const sats = buf[gpsOffset + 12];
//     const spd = buf.readInt16BE(gpsOffset + 13);

//     const ioOffset = gpsOffset + 15;
//     const { ioMap } = parseCodec8IO(buf, ioOffset);

//     let card_id = null;
//     if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
//       card_id = ioMap[157].hex.toLowerCase();
//     }

//     const record = {
//       timestamp: dt,
//       longitude: lng,
//       latitude: lat,
//       altitude: alt,
//       angle: ang,
//       satellites: sats,
//       speed: spd,
//       card_id,
//       raw_hex
//     };

//     const collectionName = `trek_${year}`;
//     const col = db.collection(collectionName);

//     const query = { date, imei };
//     const exists = await col.findOne(query);

//     if (exists) {
//       await col.updateOne(query, { $push: { data: record } });
//     } else {
//       await col.insertOne({ date, imei, data: [record] });
//     }

//     logToFile(`✅ [${imei}] Saved to ${collectionName} card=${card_id || 'none'}`);
//   } catch (e) {
//     logToFile(`❌ Decode error [${imei}]: ${e.message}`);
//   }
// }

// // === Server start ===
// async function start() {
//   try {
//     await client.connect();
//     const db = client.db(DATABASE_NAME);
//     logToFile(`✅ MongoDB connected`);

//     const server = net.createServer(sock => {
//       logToFile(`🔌 Client connected: ${sock.remoteAddress}:${sock.remotePort}`);

//       let imei = '';

//       sock.on('data', async data => {
//         try {
//           // Якщо IMEI ще не отримано
//           if (!imei) {
//             imei = cleanImei(data.toString());
//             logToFile(`📡 IMEI: ${imei}`);
//             sendConfirmation(sock);
//             return;
//           }

//           // AVL пакети
//           await decodeAvlData(data, imei, db);
//           sendConfirmation(sock);

//         } catch (err) {
//           logToFile(`❌ Socket data handler error: ${err.message}`);
//         }
//       });

//       sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
//       sock.on('error', e => logToFile(`⚠️ Socket error: ${e.message}`));
//     });

//     server.listen(PORT, HOST, () =>
//       logToFile(`🚀 TCP Server listening on ${HOST}:${PORT}`)
//     );

//   } catch (e) {
//     logToFile(`💥 Fatal: ${e.message}`);
//   }
// }

// start();




const net = require('net');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// === Налаштування ===
const HOST = '0.0.0.0';
const PORT = 20120;
const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
const DATABASE_NAME = 'test';
const COLLECTION_NAME = 'avl_records';

// === Папка для логів ===
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// === Допоміжна функція для запису в лог ===
function logToFile(message) {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const logFile = path.join(LOG_DIR, `${date}.log`);
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  console.log(message);
}

// === MongoDB клієнт ===
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// === Старт сервера ===
async function startServer() {
  await client.connect();
  logToFile('✅ Connected to MongoDB');

  const db = client.db(DATABASE_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const server = net.createServer(socket => {
    logToFile(`🔌 Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

    let imei = '';

    socket.once('data', data => {
      imei = cleanImei(data.toString().trim());
      logToFile(`📡 Received IMEI: ${imei}`);
      sendConfirmation(socket);

      socket.on('data', packet => {
        const hexString = packet.toString('hex');
        logToFile(`📦 RAW HEX (${imei}): ${hexString}`); // ✅ повний сирий пакет

        decodeAvlData(packet, imei, collection);
        sendConfirmation(socket);
      });

      socket.on('close', () => logToFile(`❌ Client disconnected: ${imei}`));
      socket.on('error', err => logToFile(`⚠️ Socket error: ${err.message}`));
    });
  });

  server.listen(PORT, HOST, () => logToFile(`🚀 Server listening on ${HOST}:${PORT}`));
}

// === Допоміжні функції ===
function cleanImei(imei) {
  return imei.replace(/\D/g, '');
}

function sendConfirmation(socket) {
  socket.write(Buffer.from([0x01]));
}

// === IO Парсер ===
function parseCodec8IO(buf, ioOffset) {
  let offset = ioOffset;
  const ioMap = {};

  if (offset >= buf.length) return { ioMap, nextOffset: offset };

  try {
    offset += 1; // eventId
    const totalIO = buf.readUInt8(offset); offset += 1;

    const readIO = (count, size) => {
      const map = {};
      for (let i = 0; i < count; i++) {
        const id = buf.readUInt8(offset); offset += 1;
        const valBuf = buf.slice(offset, offset + size); offset += size;
        map[id] = { size, hex: valBuf.toString('hex') };
      }
      return map;
    };

    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 1));
    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 2));
    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 4));
    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 8));

    return { ioMap, nextOffset: offset };
  } catch {
    return { ioMap, nextOffset: offset };
  }
}

// === Основна функція розбору AVL ===
async function decodeAvlData(buffer, imei, collection) {
  try {
    if (buffer.length < 34) return logToFile(`⚠️ [${imei}] Packet too short`);

    const timestamp = Number(buffer.readBigUInt64BE(10)) / 1000;
    const timestampDate = new Date(timestamp * 1000);
    const date = timestampDate.toISOString().split('T')[0];

    const gpsDataOffset = 19;
    if (buffer.length < gpsDataOffset + 15) return logToFile(`⚠️ [${imei}] Packet too short for GPS`);

    const longitude = buffer.readInt32BE(gpsDataOffset) / 1e7;
    const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 1e7;
    const altitude = buffer.readInt16BE(gpsDataOffset + 8);
    const angle = buffer.readInt16BE(gpsDataOffset + 10);
    const satellites = buffer[gpsDataOffset + 12];
    const speed = buffer.readInt16BE(gpsDataOffset + 13);

    const ioStartOffset = gpsDataOffset + 15;
    const { ioMap } = parseCodec8IO(buffer, ioStartOffset);

    let card_id = null;
    if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
      card_id = ioMap[157].hex.toLowerCase();
    }

    const dataRecord = { timestamp: timestampDate, longitude, latitude, altitude, angle, satellites, speed, card_id };

    const query = { date, imei };
    const existing = await collection.findOne(query);

    if (existing) {
      await collection.updateOne(query, { $push: { data: dataRecord } });
    } else {
      await collection.insertOne({ date, imei, data: [dataRecord] });
    }

    logToFile(`✅ [${imei}] Inserted record. card_id=${card_id || 'none'}`);
  } catch (err) {
    logToFile(`❌ [${imei}] Error decoding AVL data: ${err.message}`);
  }
}

startServer().catch(err => logToFile(`💥 Server failed to start: ${err.message}`));
