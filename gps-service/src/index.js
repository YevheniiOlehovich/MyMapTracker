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

const HOST = '0.0.0.0';
const PORT = 20120;
const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
const DATABASE_NAME = 'test';

const client = new MongoClient(MONGODB_URI);

async function start() {
  await client.connect();
  const db = client.db(DATABASE_NAME);
  console.log('✅ MongoDB connected');

  const server = net.createServer(sock => {
    console.log(`🔌 Client connected: ${sock.remoteAddress}:${sock.remotePort}`);

    let imei = null;
    let initialized = false;

    sock.on('data', async data => {
      try {
        // --- Пакет ініціалізації ---
        if (!initialized) {
          if (data.length < 17) {
            console.log('⚠️ Пакет занадто короткий для ініціалізації');
            sock.write(Buffer.from([0x00])); // не підтверджуємо
            sock.end();
            return;
          }

          // Перші 2 байти — службові
          const header = data.slice(0, 2);
          if (header[0] !== 0x00 || header[1] !== 0x0F) {
            console.log('⚠️ Невірний заголовок пакету ініціалізації');
            sock.write(Buffer.from([0x00]));
            sock.end();
            return;
          }

          // Останні 15 байт — IMEI у ASCII
          imei = data.slice(2, 17).toString('ascii');
          console.log(`📡 IMEI received: ${imei}`);

          sock.write(Buffer.from([0x01])); // підтвердження з'єднання
          initialized = true;
          return;
        }

        // --- Прийом AVL/RAW пакетів ---
        const collection = db.collection(`packets_${imei}`);
        await collection.insertOne({
          timestamp: new Date(),
          raw: data.toString('hex')
        });
        console.log(`✅ Saved packet for IMEI ${imei} (${data.length} bytes)`);

        sock.write(Buffer.from([0x01])); // підтвердження пакету

      } catch (e) {
        console.log('❌ Error handling data:', e.message);
      }
    });

    sock.on('close', () => console.log(`🔴 Client disconnected: ${imei || 'unknown'}`));
    sock.on('error', e => console.log(`⚠️ Socket error: ${e.message}`));
  });

  server.listen(PORT, HOST, () =>
    console.log(`🚀 TCP Server listening on ${HOST}:${PORT}`)
  );
}

start().catch(e => console.log('💥 Fatal:', e.message));
