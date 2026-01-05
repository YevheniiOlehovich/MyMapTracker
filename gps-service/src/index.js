// // //Більш-менш робочий білд
// import dotenv from 'dotenv';

// dotenv.config();

// const net = require('net');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');
// const path = require('path');

// // === Settings ===
// const HOST = '0.0.0.0';
// const PORT = 20120;
// // const MONGODB_URI = 'mongodb+srv://keildra258:x!GGzkWM_b8mwEA@cluster0.k4l1p.mongodb.net/?appName=Cluster0';
// const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;
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


// ================= ENV =================
// import dotenv from 'dotenv';
// dotenv.config();

// ================= CORE =================
import net from 'net';
import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';

// ================= __dirname (ESM) =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= SETTINGS =================
const HOST = '0.0.0.0';
const PORT = 20120;

// const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;
MONGODB_URI = `mongodb://mongo:27017/test`
const DATABASE_NAME = 'test';

// ================= LOGGING =================
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function log(message) {
  const date = new Date().toISOString().split('T')[0];
  const file = path.join(LOG_DIR, `${date}.log`);
  const line = `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFileSync(file, line);
  console.log(message);
}

// ================= DB =================
const client = new MongoClient(MONGODB_URI);

// ================= HELPERS =================
const cleanImei = imei => imei.replace(/\D/g, '');

const sendConfirmation = socket => {
  socket.write(Buffer.from([0x01]));
};

// ================= CRC16 TELTONIKA =================
function crc16Teltonika(buf) {
  let crc = 0x0000;

  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xA001 : crc >>> 1;
    }
  }

  return crc;
}

// ================= PARSE IO =================
function parseCodec8IO(buf, offset) {
  const io = {};
  try {
    const eventId = buf.readUInt8(offset++);
    offset++; // total IO (не використовуємо)

    const read = (count, size) => {
      for (let i = 0; i < count; i++) {
        const id = buf.readUInt8(offset++);
        const value = buf.slice(offset, offset + size).toString('hex');
        offset += size;
        io[id] = value;
      }
    };

    read(buf.readUInt8(offset++), 1);
    read(buf.readUInt8(offset++), 2);
    read(buf.readUInt8(offset++), 4);
    read(buf.readUInt8(offset++), 8);

    return { io, eventId };
  } catch {
    return { io: {}, eventId: null };
  }
}

// ================= DECODE AVL =================
async function decodeAVL(buffer, imei, db) {
  try {
    const rawHex = buffer.toString('hex');

    const dataLen = buffer.readUInt32BE(4);
    const avlStart = 8;
    const avlBuf = buffer.slice(avlStart, avlStart + dataLen);

    const crcCalc = crc16Teltonika(avlBuf);
    const crcPacket = buffer.readUInt16BE(buffer.length - 2);
    const crcValid = crcCalc === crcPacket;

    const timestamp = Number(avlBuf.readBigUInt64BE(2)) / 1000;
    const dateObj = new Date(timestamp * 1000);

    const gpsOffset = 11;
    const longitude = avlBuf.readInt32BE(gpsOffset) / 1e7;
    const latitude = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
    const altitude = avlBuf.readInt16BE(gpsOffset + 8);
    const angle = avlBuf.readInt16BE(gpsOffset + 10);
    const satellites = avlBuf[gpsOffset + 12];
    const speed = avlBuf.readInt16BE(gpsOffset + 13);

    const { io, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);
    const card_id = io[157] && !/^0+$/.test(io[157]) ? io[157] : null;

    const collection = `trek_${dateObj.getFullYear()}`;
    const col = db.collection(collection);

    const key = {
      date: dateObj.toISOString().split('T')[0],
      imei
    };

    const record = {
      timestamp: dateObj,
      latitude,
      longitude,
      altitude,
      angle,
      satellites,
      speed,
      io,
      eventId,
      card_id,
      raw: rawHex,
      crc: {
        calculated: crcCalc.toString(16),
        packet: crcPacket.toString(16),
        valid: crcValid ? 1 : 0
      }
    };

    await col.updateOne(
      key,
      { $push: { data: record } },
      { upsert: true }
    );

    log(`✅ ${imei} saved ${key.date}`);
  } catch (err) {
    log(`❌ Decode error: ${err.message}`);
  }
}

// ================= SERVER =================
async function start() {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);

    log('✅ MongoDB connected');

    const server = net.createServer(socket => {
      log(`🔌 Client ${socket.remoteAddress}:${socket.remotePort}`);

      let imei = '';

      socket.on('data', async data => {
        if (!imei) {
          imei = cleanImei(data.toString());
          log(`📡 IMEI ${imei}`);
          sendConfirmation(socket);
          return;
        }

        await decodeAVL(data, imei, db);
        sendConfirmation(socket);
      });

      socket.on('close', () => log(`🔴 Disconnect ${imei}`));
      socket.on('error', err => log(`⚠️ Socket error ${err.message}`));
    });

    server.listen(PORT, HOST, () => {
      log(`🚀 TCP listening on ${HOST}:${PORT}`);
    });
  } catch (err) {
    log(`💥 Fatal error: ${err.message}`);
    process.exit(1);
  }
}

start();
