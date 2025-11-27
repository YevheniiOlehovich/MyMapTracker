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

// === IO parser ===
function parseCodec8IO(buf, offset) {
  const ioMap = {};
  try {
    offset += 2; // skip eventID + totalIO
    const readIO = (count, size) => {
      const m = {};
      for (let i = 0; i < count; i++) {
        const id = buf.readUInt8(offset++);
        const v = buf.slice(offset, offset + size);
        offset += size;
        m[id] = { size, hex: v.toString('hex') };
      }
      return m;
    };
    let count;
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 1));
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 2));
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 4));
    count = buf.readUInt8(offset++); Object.assign(ioMap, readIO(count, 8));
  } catch {}
  return { ioMap };
}

// === Decode AVL ===
async function decodeAvlData(buf, imei, db) {
  try {
    if (buf.length < 34) {
      logToFile(`⚠️ Packet too short (${buf.length} bytes) from ${imei}`);
      return;
    }

    const raw_hex = buf.toString('hex');
    logToFile(`📦 RAW HEX (${imei}): ${raw_hex}`);
    logToFile(`📏 Packet length: ${buf.length} bytes`);

    // === GPS parsing ===
    const gpsOffset = 19;
    if (buf.length < gpsOffset + 15) {
      logToFile(`⚠️ Packet too short for GPS parsing: ${buf.length} bytes`);
      return;
    }

    const ts = Number(buf.readBigUInt64BE(10)) / 1000;
    const dt = new Date(ts * 1000);
    const date = dt.toISOString().split('T')[0];
    const year = dt.getFullYear();

    const lng = buf.readInt32BE(gpsOffset) / 1e7;
    const lat = buf.readInt32BE(gpsOffset + 4) / 1e7;
    const alt = buf.readInt16BE(gpsOffset + 8);
    const ang = buf.readInt16BE(gpsOffset + 10);
    const sats = buf[gpsOffset + 12];
    const spd = buf.readInt16BE(gpsOffset + 13);

    const ioOffset = gpsOffset + 15;
    const { ioMap } = parseCodec8IO(buf, ioOffset);

    let card_id = null;
    if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
      card_id = ioMap[157].hex.toLowerCase();
    }

    const record = {
      timestamp: dt,
      longitude: lng,
      latitude: lat,
      altitude: alt,
      angle: ang,
      satellites: sats,
      speed: spd,
      card_id,
      raw_hex
    };

    const collectionName = `trek_${year}`;
    const col = db.collection(collectionName);

    const q = { date, imei };
    logToFile(`🔍 Query: ${JSON.stringify(q)}`);

    const exists = await col.findOne(q);
    if (exists) {
      await col.updateOne(q, { $push: { data: record } });
    } else {
      await col.insertOne({ date, imei, data: [record] });
    }

    logToFile(`✅ [${imei}] Saved to ${collectionName} card=${card_id || 'none'}`);

  } catch (e) {
    logToFile(`❌ Decode error [${imei}]: ${e.message}`);
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
        try {
          // перший пакет IMEI
          if (!imei) {
            logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
            imei = cleanImei(data.toString());
            logToFile(`📡 IMEI parsed: ${imei}`);
            sendConfirmation(sock);
            return;
          }

          // усі наступні пакети AVL
          logToFile(`📥 AVL PACKET RAW (${imei}): ${data.toString('hex')}`);
          logToFile(`📏 Packet length: ${data.length} bytes`);

          await decodeAvlData(data, imei, db);
          sendConfirmation(sock);

        } catch (err) {
          logToFile(`❌ Socket data handler error: ${err.message}`);
        }
      });

      sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
      sock.on('error', e => logToFile(`⚠️ Socket error: ${e.message}`));
    });

    server.listen(PORT, HOST, () =>
      logToFile(`🚀 Listening TCP ${HOST}:${PORT}`)
    );

  } catch (e) {
    logToFile(`💥 Fatal: ${e.message}`);
  }
}

start();

