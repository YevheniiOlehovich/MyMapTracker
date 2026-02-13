// import net from 'net';
// import fs from 'fs';
// import path from 'path';
// import { MongoClient } from 'mongodb';
// import { fileURLToPath } from 'url';

// // ================= __dirname (ESM) =================
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ================= SETTINGS =================
// const HOST = '0.0.0.0';
// const PORT = 20120;
// const MONGODB_URI = 'mongodb://mongo:27017/test';
// const DATABASE_NAME = 'test';
// const SOCKET_TIMEOUT_MS = 60_000; // 60 секунд

// // ================= LOGGING (ASYNC QUEUE) =================
// const LOG_DIR = path.join(__dirname, 'logs');
// if (!fs.existsSync(LOG_DIR)) {
//   fs.mkdirSync(LOG_DIR, { recursive: true });
// }

// const logQueue = [];
// let flushing = false;

// function log(message) {
//   const line = `[${new Date().toISOString()}] ${message}\n`;
//   logQueue.push(line);
//   console.log(message);
// }

// setInterval(() => {
//   if (logQueue.length === 0 || flushing) return;

//   flushing = true;

//   const date = new Date().toISOString().split('T')[0];
//   const file = path.join(LOG_DIR, `${date}.log`);
//   const batch = logQueue.splice(0, logQueue.length).join('');

//   fs.appendFile(file, batch, err => {
//     flushing = false;
//     if (err) console.error('Log flush error:', err);
//   });
// }, 1000);

// // ================= DB =================
// const client = new MongoClient(MONGODB_URI);

// // ================= HELPERS =================
// const cleanImei = imei => imei.replace(/\D/g, '');
// const sendConfirmation = socket => socket.write(Buffer.from([0x01]));

// // ================= CRC16 =================
// function crc16Teltonika(buf) {
//   let crc = 0x0000;
//   for (let i = 0; i < buf.length; i++) {
//     crc ^= buf[i];
//     for (let j = 0; j < 8; j++) {
//       crc = crc & 1 ? (crc >>> 1) ^ 0xA001 : crc >>> 1;
//     }
//   }
//   return crc;
// }

// // ================= HEX → DEC =================
// function hexToDec(value) {
//   if (!value) return null;
//   try {
//     return parseInt(value, 16);
//   } catch {
//     return null;
//   }
// }

// // ================= PARSE IO =================
// function parseCodec8IO(buf, offset) {
//   const io = {};
//   try {
//     const eventId = buf.readUInt8(offset++);
//     offset++; // total IO

//     const BLE_IDS_IO = [131];

//     const read = (count, size) => {
//       for (let i = 0; i < count; i++) {
//         const id = buf.readUInt8(offset++);
//         const valueHex = buf.slice(offset, offset + size).toString('hex');
//         offset += size;

//         if (BLE_IDS_IO.includes(id)) {
//           const dec = hexToDec(valueHex);
//           io[id] = dec !== null ? dec : valueHex;
//         } else {
//           io[id] = valueHex;
//         }
//       }
//     };

//     read(buf.readUInt8(offset++), 1);
//     read(buf.readUInt8(offset++), 2);
//     read(buf.readUInt8(offset++), 4);
//     read(buf.readUInt8(offset++), 8);

//     return { io, eventId };
//   } catch {
//     return { io: {}, eventId: null };
//   }
// }

// // ================= DECODE =================
// async function decodeAVL(buffer, imei, db) {
//   try {
//     const rawHex = buffer.toString('hex');

//     const dataLen = buffer.readUInt32BE(4);
//     const avlBuf = buffer.slice(8, 8 + dataLen);

//     const crcCalc = crc16Teltonika(avlBuf);
//     const crcPacket = buffer.readUInt16BE(buffer.length - 2);
//     const crcValid = crcCalc === crcPacket;

//     const timestamp = Number(avlBuf.readBigUInt64BE(2)) / 1000;
//     const dateObj = new Date(timestamp * 1000);

//     const gpsOffset = 11;
//     const longitude = avlBuf.readInt32BE(gpsOffset) / 1e7;
//     const latitude = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
//     const altitude = avlBuf.readInt16BE(gpsOffset + 8);
//     const angle = avlBuf.readInt16BE(gpsOffset + 10);
//     const satellites = avlBuf[gpsOffset + 12];
//     const speed = avlBuf.readInt16BE(gpsOffset + 13);

//     const { io, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);
//     const card_id = io[157] && !/^0+$/.test(io[157]) ? io[157] : null;

//     const collection = `trek_${dateObj.getFullYear()}`;
//     const col = db.collection(collection);

//     const key = {
//       date: dateObj.toISOString().split('T')[0],
//       imei
//     };

//     const record = {
//       timestamp: dateObj,
//       latitude,
//       longitude,
//       altitude,
//       angle,
//       satellites,
//       speed,
//       io,
//       eventId,
//       card_id,
//       raw: rawHex,
//       crc: {
//         calculated: crcCalc.toString(16),
//         packet: crcPacket.toString(16),
//         valid: crcValid ? 1 : 0
//       }
//     };

//     await col.updateOne(
//       key,
//       { $push: { data: record } },
//       { upsert: true }
//     );

//     log(`✅ ${imei} saved ${key.date}`);
//   } catch (err) {
//     log(`❌ Decode error: ${err.message}`);
//   }
// }

// // ================= SERVER =================
// async function start() {
//   try {
//     await client.connect();
//     const db = client.db(DATABASE_NAME);

//     log('✅ MongoDB connected');

//     const server = net.createServer(socket => {
//       log(`🔌 Client ${socket.remoteAddress}:${socket.remotePort}`);

//       let imei = '';

//       socket.setTimeout(SOCKET_TIMEOUT_MS);

//       socket.on('timeout', () => {
//         log(`⏱ Timeout ${imei || socket.remoteAddress}`);
//         socket.destroy();
//       });

//       socket.on('data', async data => {
//         if (!imei) {
//           imei = cleanImei(data.toString());
//           log(`📡 IMEI ${imei}`);
//           sendConfirmation(socket);
//           return;
//         }

//         await decodeAVL(data, imei, db);
//         sendConfirmation(socket);
//       });

//       socket.on('close', () => log(`🔴 Disconnect ${imei || 'unknown'}`));
//       socket.on('error', err => log(`⚠️ Socket error ${err.message}`));
//     });

//     server.listen(PORT, HOST, () => {
//       log(`🚀 TCP listening on ${HOST}:${PORT}`);
//     });
//   } catch (err) {
//     log(`💥 Fatal error: ${err.message}`);
//     process.exit(1);
//   }
// }

// start();







import net from "net";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";

// ================= __dirname (ESM) =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= SETTINGS =================
const HOST = "0.0.0.0";
const PORT = 20120;
const MONGODB_URI = "mongodb://mongo:27017/test";
const DATABASE_NAME = "test";
const SOCKET_TIMEOUT_MS = 60_000;

// допустимий діапазон років
const MIN_YEAR = 2015;
const MAX_YEAR = new Date().getFullYear() + 1;

// ================= LOGGING =================
const LOG_DIR = path.join(__dirname, "logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const logQueue = [];
let flushing = false;

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  logQueue.push(line);
  console.log(message);
}

setInterval(() => {
  if (!logQueue.length || flushing) return;
  flushing = true;

  const date = new Date().toISOString().split("T")[0];
  const file = path.join(LOG_DIR, `${date}.log`);
  const batch = logQueue.splice(0).join("");

  fs.appendFile(file, batch, err => {
    flushing = false;
    if (err) console.error("Log flush error:", err);
  });
}, 1000);

// ================= DB =================
const client = new MongoClient(MONGODB_URI);

// ================= HELPERS =================
const cleanImei = imei => imei.replace(/\D/g, "");
const sendConfirmation = socket => socket.write(Buffer.from([0x01]));

// ================= CRC16 =================
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

// ================= HEX → DEC =================
function hexToDec(value) {
  if (!value) return null;
  try {
    return parseInt(value, 16);
  } catch {
    return null;
  }
}

// ================= PARSE IO =================
function parseCodec8IO(buf, offset) {
  const io = {};
  try {
    const eventId = buf.readUInt8(offset++);
    offset++; // total IO

    const BLE_IDS_IO = [131];

    const read = (count, size) => {
      for (let i = 0; i < count; i++) {
        const id = buf.readUInt8(offset++);
        const valueHex = buf.slice(offset, offset + size).toString("hex");
        offset += size;

        if (BLE_IDS_IO.includes(id)) {
          const dec = hexToDec(valueHex);
          io[id] = dec !== null ? dec : valueHex;
        } else {
          io[id] = valueHex;
        }
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

// ================= SAVE TRASH =================
async function saveTrash(db, imei, buffer, extra = {}) {
  await db.collection("trash_packets").insertOne({
    imei,
    receivedAt: new Date(),
    raw: buffer.toString("hex"),
    ...extra,
  });

  log(`🗑 Trash packet from ${imei}`);
}

// ================= DECODE =================
async function decodeAVL(buffer, imei, db) {
  try {
    const rawHex = buffer.toString("hex");

    const dataLen = buffer.readUInt32BE(4);
    const avlBuf = buffer.slice(8, 8 + dataLen);

    const crcCalc = crc16Teltonika(avlBuf);
    const crcPacket = buffer.readUInt16BE(buffer.length - 2);
    const crcValid = crcCalc === crcPacket;

    const timestamp = Number(avlBuf.readBigUInt64BE(2)) / 1000;
    const dateObj = new Date(timestamp * 1000);

    const year = dateObj.getFullYear();
    const validDate =
      !isNaN(dateObj.getTime()) && year >= MIN_YEAR && year <= MAX_YEAR;

    if (!crcValid || !validDate) {
      await saveTrash(db, imei, buffer, {
        crcValid,
        year,
      });
      return;
    }

    // ================= VALID =================
    const gpsOffset = 11;
    const longitude = avlBuf.readInt32BE(gpsOffset) / 1e7;
    const latitude = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
    const altitude = avlBuf.readInt16BE(gpsOffset + 8);
    const angle = avlBuf.readInt16BE(gpsOffset + 10);
    const satellites = avlBuf[gpsOffset + 12];
    const speed = avlBuf.readInt16BE(gpsOffset + 13);

    const { io, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);
    const card_id = io[157] && !/^0+$/.test(io[157]) ? io[157] : null;

    const collection = `trek_${year}`;
    const col = db.collection(collection);

    const key = {
      date: dateObj.toISOString().split("T")[0],
      imei,
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
        valid: 1,
      },
    };

    await col.updateOne(key, { $push: { data: record } }, { upsert: true });

    log(`✅ ${imei} saved ${key.date}`);
  } catch (err) {
    log(`❌ Decode crash: ${err.message}`);
    await saveTrash(db, imei, buffer, { fatal: err.message });
  }
}

// ================= SERVER =================
async function start() {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);

    log("✅ MongoDB connected");

    const server = net.createServer(socket => {
      log(`🔌 Client ${socket.remoteAddress}:${socket.remotePort}`);

      let imei = "";

      socket.setTimeout(SOCKET_TIMEOUT_MS);

      socket.on("timeout", () => {
        log(`⏱ Timeout ${imei || socket.remoteAddress}`);
        socket.destroy();
      });

      socket.on("data", async data => {
        if (!imei) {
          imei = cleanImei(data.toString());
          log(`📡 IMEI ${imei}`);
          sendConfirmation(socket);
          return;
        }

        await decodeAVL(data, imei, db);
        sendConfirmation(socket);
      });

      socket.on("close", () =>
        log(`🔴 Disconnect ${imei || socket.remoteAddress}`)
      );
      socket.on("error", err => log(`⚠️ Socket error ${err.message}`));
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
