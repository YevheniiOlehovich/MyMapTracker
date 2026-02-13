import "dotenv/config";
import net from "net";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";

// ================= __dirname =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= ENV =================
const HOST = process.env.HOST;
const PORT = Number(process.env.PORT);
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const SOCKET_TIMEOUT_MS = Number(process.env.SOCKET_TIMEOUT_MS);

// ================= LOGS =================
const LOG_DIR = path.join(__dirname, "../logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  const date = new Date().toISOString().split("T")[0];
  const file = path.join(LOG_DIR, `${date}.log`);

  console.log(message);
  fs.appendFile(file, line, () => {});
}

// ================= DB =================
const client = new MongoClient(MONGODB_URI);

// ================= HELPERS =================
const cleanImei = (imei) => imei.replace(/\D/g, "");
const sendConfirmation = (socket) => socket.write(Buffer.from([0x01]));

// ================= SAVE =================
async function saveRaw(db, imei, data) {
  try {
    const now = new Date();
    const collection = `weather_${now.getFullYear()}`;

    await db.collection(collection).insertOne({
      imei,
      timestamp: now,
      raw: data.toString("hex"),
    });

    log(`✅ saved ${imei}`);
  } catch (err) {
    log(`❌ save error ${err.message}`);
  }
}

// ================= START =================
async function start() {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);

    log("✅ Mongo connected");

    const server = net.createServer((socket) => {
      log(`🔌 ${socket.remoteAddress}:${socket.remotePort}`);

      let imei = "";

      socket.setTimeout(SOCKET_TIMEOUT_MS);

      socket.on("timeout", () => {
        log(`⏱ timeout ${imei || socket.remoteAddress}`);
        socket.destroy();
      });

      socket.on("data", async (data) => {
        if (!imei) {
          imei = cleanImei(data.toString());
          log(`📡 IMEI ${imei}`);
          sendConfirmation(socket);
          return;
        }

        await saveRaw(db, imei, data);
        sendConfirmation(socket);
      });

      socket.on("close", () => log(`🔴 disconnect ${imei || "unknown"}`));
      socket.on("error", (err) => log(`⚠️ ${err.message}`));
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
