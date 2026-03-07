// import "dotenv/config";
// import net from "net";
// import fs from "fs";
// import path from "path";
// import { MongoClient } from "mongodb";
// import { fileURLToPath } from "url";

// // ================= __dirname =================
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ================= ENV =================
// const HOST = process.env.HOST;
// const PORT = Number(process.env.PORT);
// const MONGODB_URI = process.env.MONGODB_URI;
// const DATABASE_NAME = process.env.DATABASE_NAME;
// const SOCKET_TIMEOUT_MS = Number(process.env.SOCKET_TIMEOUT_MS);

// // ================= LOGS =================
// const LOG_DIR = path.join(__dirname, "../logs");
// if (!fs.existsSync(LOG_DIR)) {
//   fs.mkdirSync(LOG_DIR, { recursive: true });
// }

// function log(message) {
//   const line = `[${new Date().toISOString()}] ${message}\n`;
//   const date = new Date().toISOString().split("T")[0];
//   const file = path.join(LOG_DIR, `${date}.log`);

//   console.log(message);
//   fs.appendFile(file, line, () => {});
// }

// // ================= DB =================
// const client = new MongoClient(MONGODB_URI);

// // ================= HELPERS =================
// const cleanImei = (imei) => imei.replace(/\D/g, "");
// const sendConfirmation = (socket) => socket.write(Buffer.from([0x01]));

// // ================= SAVE =================
// async function saveRaw(db, imei, data) {
//   try {
//     const now = new Date();
//     const collection = `weather_${now.getFullYear()}`;

//     await db.collection(collection).insertOne({
//       imei,
//       timestamp: now,
//       raw: data.toString("hex"),
//     });

//     log(`✅ saved ${imei}`);
//   } catch (err) {
//     log(`❌ save error ${err.message}`);
//   }
// }

// // ================= START =================
// async function start() {
//   try {
//     await client.connect();
//     const db = client.db(DATABASE_NAME);

//     log("✅ Mongo connected");

//     const server = net.createServer((socket) => {
//       log(`🔌 ${socket.remoteAddress}:${socket.remotePort}`);

//       let imei = "";

//       socket.setTimeout(SOCKET_TIMEOUT_MS);

//       socket.on("timeout", () => {
//         log(`⏱ timeout ${imei || socket.remoteAddress}`);
//         socket.destroy();
//       });

//       socket.on("data", async (data) => {
//         if (!imei) {
//           imei = cleanImei(data.toString());
//           log(`📡 IMEI ${imei}`);
//           sendConfirmation(socket);
//           return;
//         }

//         await saveRaw(db, imei, data);
//         sendConfirmation(socket);
//       });

//       socket.on("close", () => log(`🔴 disconnect ${imei || "unknown"}`));
//       socket.on("error", (err) => log(`⚠️ ${err.message}`));
//     });

//     server.listen(PORT, HOST, () => {
//       log(`🚀 Weather TCP ${HOST}:${PORT}`);
//     });
//   } catch (err) {
//     log(`💥 ${err.message}`);
//     process.exit(1);
//   }
// }

// start();




// import "dotenv/config";
// import net from "net";
// import fs from "fs";
// import path from "path";
// import { MongoClient } from "mongodb";
// import { fileURLToPath } from "url";

// // ================= __dirname =================
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ================= ENV =================
// const HOST = process.env.HOST || "0.0.0.0";
// const PORT = Number(process.env.PORT || 20220);
// const MONGODB_URI = process.env.MONGODB_URI;
// const DATABASE_NAME = process.env.DATABASE_NAME;
// const SOCKET_TIMEOUT_MS = Number(process.env.SOCKET_TIMEOUT_MS || 30000);

// // ================= LOGS =================
// const LOG_DIR = path.join(__dirname, "../logs");

// if (!fs.existsSync(LOG_DIR)) {
//   fs.mkdirSync(LOG_DIR, { recursive: true });
// }

// function log(message) {
//   const line = `[${new Date().toISOString()}] ${message}\n`;
//   const date = new Date().toISOString().split("T")[0];
//   const file = path.join(LOG_DIR, `${date}.log`);

//   console.log(message);
//   fs.appendFile(file, line, () => {});
// }

// // ================= DB =================
// const client = new MongoClient(MONGODB_URI);

// // ================= SAVE =================
// async function savePacket(db, socket, data) {
//   try {

//     const now = new Date();
//     const collection = `weather_${now.getFullYear()}`;

//     await db.collection(collection).insertOne({
//       timestamp: now,
//       ip: socket.remoteAddress,
//       port: socket.remotePort,
//       raw: data.toString("hex"),
//       size: data.length
//     });

//     log(`💾 saved packet ${data.length} bytes`);

//   } catch (err) {

//     log(`❌ save error ${err.message}`);

//   }
// }

// // ================= START =================
// async function start() {

//   try {

//     await client.connect();
//     const db = client.db(DATABASE_NAME);

//     log("✅ Mongo connected");

//     const server = net.createServer((socket) => {

//       log(`🔌 connect ${socket.remoteAddress}:${socket.remotePort}`);

//       socket.setTimeout(SOCKET_TIMEOUT_MS);

//       socket.on("timeout", () => {

//         log(`⏱ timeout ${socket.remoteAddress}`);
//         socket.destroy();

//       });

//       socket.on("data", async (data) => {

//         const hex = data.toString("hex");

//         log(`📥 ${hex}`);

//         await savePacket(db, socket, data);

//         // universal ACK
//         socket.write(Buffer.from([0x01]));

//       });

//       socket.on("close", () => {

//         log(`🔴 disconnect ${socket.remoteAddress}`);

//       });

//       socket.on("error", (err) => {

//         log(`⚠️ ${err.message}`);

//       });

//     });

//     server.listen(PORT, HOST, () => {

//       log(`🚀 TCP server ${HOST}:${PORT}`);

//     });

//   } catch (err) {

//     log(`💥 ${err.message}`);
//     process.exit(1);

//   }

// }

// start();




// weather-service

// import "dotenv/config";
// import net from "net";
// import fs from "fs";
// import path from "path";
// import { MongoClient } from "mongodb";
// import { fileURLToPath } from "url";

// // ================= PATH =================

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ================= ENV =================

// const HOST = process.env.HOST || "0.0.0.0";
// const PORT = Number(process.env.PORT || 20220);
// const MONGODB_URI = process.env.MONGODB_URI;
// const DATABASE_NAME = process.env.DATABASE_NAME;
// const SOCKET_TIMEOUT_MS = Number(process.env.SOCKET_TIMEOUT_MS || 60000);

// // ================= LOGS =================

// const LOG_DIR = path.join(__dirname, "../logs");

// if (!fs.existsSync(LOG_DIR)) {
//   fs.mkdirSync(LOG_DIR, { recursive: true });
// }

// function log(message) {

//   const line = `[${new Date().toISOString()}] ${message}\n`;
//   const file = path.join(
//     LOG_DIR,
//     `${new Date().toISOString().split("T")[0]}.log`
//   );

//   console.log(message);
//   fs.appendFile(file, line, () => {});

// }

// // ================= DB =================

// const client = new MongoClient(MONGODB_URI);

// // ================= GPS CONVERTER =================

// function convertCoordinates(latRaw, latDir, lonRaw, lonDir) {

//   if (!latRaw || !lonRaw) return { lat: null, lon: null };

//   const latDeg = Number(latRaw.slice(0, 2));
//   const latMin = Number(latRaw.slice(2));

//   const lonDeg = Number(lonRaw.slice(0, 3));
//   const lonMin = Number(lonRaw.slice(3));

//   let lat = latDeg + latMin / 60;
//   let lon = lonDeg + lonMin / 60;

//   if (latDir === "S") lat *= -1;
//   if (lonDir === "W") lon *= -1;

//   return { lat, lon };

// }

// // ================= PARAM PARSER =================

// function parseParams(str) {

//   const params = {};
//   const list = str.split(",");

//   for (const p of list) {

//     if (!p.startsWith("par")) continue;

//     const clean = p.replace("par", "");
//     const [id, type, value] = clean.split(":");

//     params[`param_${id}`] = Number(value);

//   }

//   return params;

// }

// // ================= PACKET PARSER =================

// function parseWeatherPacket(raw) {

//   const parts = raw.split(";");

//   if (parts.length < 6) {
//     return { raw };
//   }

//   const date = parts[0];
//   const time = parts[1];

//   const latRaw = parts[2];
//   const latDir = parts[3];

//   const lonRaw = parts[4];
//   const lonDir = parts[5];

//   const speed = Number(parts[6]) || 0;
//   const course = Number(parts[7]) || 0;

//   const gps = convertCoordinates(latRaw, latDir, lonRaw, lonDir);

//   const params = parseParams(parts.slice(15).join(";"));

//   return {

//     date,
//     time,
//     lat: gps.lat,
//     lon: gps.lon,
//     speed,
//     course,
//     ...params,
//     raw

//   };

// }

// // ================= SAVE =================

// async function savePacket(db, imei, socket, message) {

//   try {

//     const parsed = parseWeatherPacket(message);

//     const now = new Date();

//     const collection = `weather_${now.getFullYear()}`;

//     await db.collection(collection).insertOne({

//       imei,
//       timestamp: now,
//       ip: socket.remoteAddress,
//       port: socket.remotePort,

//       ...parsed

//     });

//     log(`💾 saved packet`);

//   } catch (err) {

//     log(`❌ save error ${err.message}`);

//   }

// }

// // ================= SERVER =================

// async function start() {

//   try {

//     await client.connect();
//     const db = client.db(DATABASE_NAME);

//     log("✅ Mongo connected");

//     const server = net.createServer((socket) => {

//       log(`🔌 connect ${socket.remoteAddress}:${socket.remotePort}`);

//       let imei = null;

//       socket.setTimeout(SOCKET_TIMEOUT_MS);

//       // ================= TIMEOUT =================

//       socket.on("timeout", () => {

//         log(`⏱ timeout ${imei || socket.remoteAddress}`);
//         socket.destroy();

//       });

//       // ================= DATA =================

//       socket.on("data", async (data) => {

//         const message = data.toString().trim();

//         log(`📥 ${message}`);

//         // ================= LOGIN =================

//         if (message.startsWith("#L#")) {

//           try {

//             const body = message.replace("#L#", "");
//             const parts = body.split(";");

//             imei = parts[0];

//             log(`📡 IMEI ${imei}`);

//             socket.write("#AL#1\r\n");

//             log("📤 login ack");

//           } catch {

//             log("❌ login parse error");

//           }

//           return;

//         }

//         // ================= DATA PACKET =================

//         if (message.startsWith("#D#")) {

//           const body = message.replace("#D#", "");

//           await savePacket(db, imei, socket, body);

//           socket.write("#AD#1\r\n");

//           log("📤 data ack");

//           return;

//         }

//         socket.write("#OK#\r\n");

//       });

//       // ================= CLOSE =================

//       socket.on("close", () => {

//         log(`🔴 disconnect ${imei || socket.remoteAddress}`);

//       });

//       // ================= ERROR =================

//       socket.on("error", (err) => {

//         log(`⚠️ ${err.message}`);

//       });

//     });

//     server.listen(PORT, HOST, () => {

//       log(`🚀 Weather TCP ${HOST}:${PORT}`);

//     });

//   } catch (err) {

//     log(`💥 ${err.message}`);
//     process.exit(1);

//   }

// }

// start();



// gps2 шось робить і прийма

// import net from "net";

// const HOST = "0.0.0.0";
// const PORT = 20220;

// function log(message) {
//   console.log(`[${new Date().toISOString()}] ${message}`);
// }

// const server = net.createServer(socket => {

//   const client = `${socket.remoteAddress}:${socket.remotePort}`;
//   log(`🔌 CONNECT ${client}`);

//   socket.on("data", data => {

//     const hex = data.toString("hex");
//     const text = data.toString();

//     log(`📥 ${client}`);
//     log(`HEX : ${hex}`);
//     log(`TEXT: ${text}`);

//     // якщо трекер чекає відповідь
//     socket.write(Buffer.from([0x01]));

//   });

//   socket.on("close", () => {
//     log(`🔴 DISCONNECT ${client}`);
//   });

//   socket.on("error", err => {
//     log(`⚠️ ERROR ${client} ${err.message}`);
//   });

// });

// server.listen(PORT, HOST, () => {
//   log(`🚀 TCP LOGGER listening ${HOST}:${PORT}`);
// });







//gps 2 дубль 2 

// import net from "net";

// const HOST = "0.0.0.0";
// const PORT = 20220;

// function log(message) {
//   console.log(`[${new Date().toISOString()}] ${message}`);
// }

// const server = net.createServer(socket => {

//   const client = `${socket.remoteAddress}:${socket.remotePort}`;
//   let imeiReceived = false;

//   log(`🔌 CONNECT ${client}`);

//   socket.on("data", data => {

//     const hex = data.toString("hex");
//     const text = data.toString();

//     log(`📥 ${client}`);
//     log(`HEX : ${hex}`);
//     log(`TEXT: ${text}`);

//     // ================= IMEI =================
//     if (!imeiReceived) {

//       imeiReceived = true;

//       log("📡 IMEI packet");

//       // Teltonika login ACK
//       socket.write(Buffer.from([0x01]));

//       log("📤 ACK IMEI -> 01");

//       return;
//     }

//     // ================= AVL DATA =================

//     log("📦 AVL packet");

//     const ack = Buffer.alloc(4);
//     ack.writeUInt32BE(1); // 1 record accepted

//     socket.write(ack);

//     log("📤 ACK AVL -> 00000001");

//   });

//   socket.on("close", () => {
//     log(`🔴 DISCONNECT ${client}`);
//   });

//   socket.on("error", err => {
//     log(`⚠️ ERROR ${client} ${err.message}`);
//   });

// });

// server.listen(PORT, HOST, () => {
//   log(`🚀 TCP LOGGER listening ${HOST}:${PORT}`);
// });















import net from "net";
import { MongoClient } from "mongodb";

// ================= SETTINGS =================

const HOST = "0.0.0.0";
const PORT = 20220;

const MONGODB_URI = "mongodb://mongo:27017/test";
const DATABASE_NAME = "test";

const SOCKET_TIMEOUT_MS = 60000;

// ================= DB =================

const client = new MongoClient(MONGODB_URI);

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// ================= HELPERS =================

const cleanImei = imei => imei.replace(/\D/g, "");

function sendImeiAck(socket) {
  socket.write(Buffer.from([0x01]));
}

function sendAvlAck(socket, records = 1) {
  const ack = Buffer.alloc(4);
  ack.writeUInt32BE(records);
  socket.write(ack);
}

// ================= CRC =================

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

// ================= IO PARSER =================

function parseCodec8IO(buf, offset) {

  const io = {};

  try {

    const eventId = buf.readUInt8(offset++);
    offset++;

    const read = (count, size) => {

      for (let i = 0; i < count; i++) {

        const id = buf.readUInt8(offset++);
        const value = buf.slice(offset, offset + size).toString("hex");

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

// ================= AVL PARSER =================

async function decodeAVL(buffer, imei, db) {

  try {

    const rawHex = buffer.toString("hex");

    const dataLen = buffer.readUInt32BE(4);

    const avlBuf = buffer.slice(8, 8 + dataLen);

    const crcCalc = crc16Teltonika(avlBuf);
    const crcPacket = buffer.readUInt16BE(buffer.length - 2);

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

    const doc = {

      imei,

      timestamp: dateObj,

      latitude,
      longitude,

      altitude,
      angle,

      satellites,
      speed,

      eventId,

      io,

      raw: rawHex,

      crc: {
        calculated: crcCalc.toString(16),
        packet: crcPacket.toString(16)
      }

    };

    await db.collection("930").insertOne(doc);

    log(`💾 saved packet ${imei}`);

  } catch (err) {

    log(`❌ decode error ${err.message}`);

  }

}

// ================= SERVER =================

async function start() {

  await client.connect();

  const db = client.db(DATABASE_NAME);

  log("✅ Mongo connected");

  const server = net.createServer(socket => {

    const clientAddr = `${socket.remoteAddress}:${socket.remotePort}`;

    log(`🔌 CONNECT ${clientAddr}`);

    let imei = null;

    socket.setTimeout(SOCKET_TIMEOUT_MS);

    socket.on("timeout", () => {

      log(`⏱ TIMEOUT ${clientAddr}`);
      socket.destroy();

    });

    socket.on("data", async data => {

      if (!imei) {

        imei = cleanImei(data.toString());

        log(`📡 IMEI ${imei}`);

        sendImeiAck(socket);

        return;

      }

      await decodeAVL(data, imei, db);

      sendAvlAck(socket, 1);

    });

    socket.on("close", () => {

      log(`🔴 DISCONNECT ${imei || clientAddr}`);

    });

    socket.on("error", err => {

      log(`⚠️ ${err.message}`);

    });

  });

  server.listen(PORT, HOST, () => {

    log(`🚀 GPS TCP listening ${HOST}:${PORT}`);

  });

}

start();