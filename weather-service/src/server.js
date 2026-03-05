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




import "dotenv/config";
import net from "net";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";

// ================= PATH =================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= ENV =================

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 20220);
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const SOCKET_TIMEOUT_MS = Number(process.env.SOCKET_TIMEOUT_MS || 60000);

// ================= LOG DIR =================

const LOG_DIR = path.join(__dirname, "../logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ================= LOGGER =================

function log(message) {

  const line = `[${new Date().toISOString()}] ${message}\n`;
  const date = new Date().toISOString().split("T")[0];
  const file = path.join(LOG_DIR, `${date}.log`);

  console.log(message);
  fs.appendFile(file, line, () => {});

}

// ================= DB =================

const client = new MongoClient(MONGODB_URI);

// ================= SAVE PACKET =================

async function savePacket(db, socket, message) {

  try {

    const now = new Date();
    const collection = `weather_${now.getFullYear()}`;

    await db.collection(collection).insertOne({

      timestamp: now,
      ip: socket.remoteAddress,
      port: socket.remotePort,
      raw: message

    });

    log(`💾 saved packet`);

  } catch (err) {

    log(`❌ save error ${err.message}`);

  }

}

// ================= SERVER =================

async function start() {

  try {

    await client.connect();

    const db = client.db(DATABASE_NAME);

    log("✅ Mongo connected");

    const server = net.createServer((socket) => {

      log(`🔌 connect ${socket.remoteAddress}:${socket.remotePort}`);

      let imei = null;

      socket.setTimeout(SOCKET_TIMEOUT_MS);

      // ================= TIMEOUT =================

      socket.on("timeout", () => {

        log(`⏱ timeout ${imei || socket.remoteAddress}`);
        socket.destroy();

      });

      // ================= DATA =================

      socket.on("data", async (data) => {

        const message = data.toString().trim();

        log(`📥 ${message}`);

        await savePacket(db, socket, message);

        // ================= LOGIN =================

        if (message.startsWith("#L#")) {

          try {

            const body = message.replace("#L#", "");
            const parts = body.split(";");

            imei = parts[0];

            log(`📡 IMEI ${imei}`);

            socket.write("#AL#1\r\n");

            log("📤 login ack");

          } catch (err) {

            log(`❌ login parse error`);

          }

          return;

        }

        // ================= DATA PACKET =================

        if (message.startsWith("#D#")) {

          socket.write("#AD#1\r\n");

          log("📤 data ack");

          return;

        }

        // ================= UNKNOWN =================

        socket.write("#OK#\r\n");

      });

      // ================= CLOSE =================

      socket.on("close", () => {

        log(`🔴 disconnect ${imei || socket.remoteAddress}`);

      });

      // ================= ERROR =================

      socket.on("error", (err) => {

        log(`⚠️ ${err.message}`);

      });

    });

    server.listen(PORT, HOST, () => {

      log(`🚀 Weather TCP ${HOST}:${PORT}`);

    });

  } catch (err) {

    log(`💥 ${err.message}`);
    process.exit(1);

  }

}

start();