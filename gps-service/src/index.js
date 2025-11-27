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

//     const ts = Number(buf.readBigUInt64BE(10)) / 1000;
//     const dt = new Date(ts * 1000);
//     const date = dt.toISOString().split('T')[0];
//     const year = dt.getFullYear();

//     const gps = 19;
//     const lng = buf.readInt32BE(gps) / 1e7;
//     const lat = buf.readInt32BE(gps + 4) / 1e7;
//     const alt = buf.readInt16BE(gps + 8);
//     const ang = buf.readInt16BE(gps + 10);
//     const sats = buf[gps + 12];
//     const spd = buf.readInt16BE(gps + 13);

//     const ioOffset = gps + 15;
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

//       // перший пакет IMEI
//       sock.once('data', data => {
//         logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
//         imei = cleanImei(data.toString());
//         logToFile(`📡 IMEI parsed: ${imei}`);
//         sendConfirmation(sock);

//         // усі наступні пакети AVL
//         sock.on('data', pkt => {
//           logToFile(`📥 AVL PACKET RAW (${imei}): ${pkt.toString('hex')}`);
//           logToFile(`📏 Packet length: ${pkt.length} bytes`);

//           decodeAvlData(pkt, imei, db);
//           sendConfirmation(sock);
//         });

//         sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
//         sock.on('error', e => logToFile(`⚠️ Socket error: ${e.message}`));
//       });
//     });

//     server.listen(PORT, HOST, () =>
//       logToFile(`🚀 Listening TCP ${HOST}:${PORT}`)
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
function crc16Teltonika(buf) {
  let crc = 0x0000;
  for (let b of buf) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 1) ? (crc >> 1) ^ 0xA001 : crc >> 1;
    }
  }
  return crc & 0xFFFF;
}

// === IO parser (для card_id 157) ===
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

// === Decode AVL & Save to DB ===
async function decodeAvlData(buf, imei, db) {
  try {
    if (buf.length < 34) {
      logToFile(`⚠️ Packet too short (${buf.length} bytes) from ${imei}`);
      return;
    }

    const raw_hex = buf.toString('hex');
    logToFile(`📦 RAW HEX (${imei}): ${raw_hex}`);

    // === CRC обчислення ===
    const crcRawBytes = buf.slice(-4);
    const crcRaw = crcRawBytes.toString('hex').toUpperCase();

    const avlBytes = buf.slice(0, -4);
    const crcCalcVal = crc16Teltonika(avlBytes);
    const crcCalc = crcCalcVal.toString(16).padStart(4, '0').toUpperCase();

    const statusOk = crcRaw.endsWith(crcCalc) ? '✅' : '❌';

    // === GPS + IO ===
    const ts = Number(buf.readBigUInt64BE(10)) / 1000;
    const dt = new Date(ts * 1000);
    const date = dt.toISOString().split('T')[0];
    const year = dt.getFullYear();

    const gps = 19;
    const lng = buf.readInt32BE(gps) / 1e7;
    const lat = buf.readInt32BE(gps + 4) / 1e7;
    const alt = buf.readInt16BE(gps + 8);
    const ang = buf.readInt16BE(gps + 10);
    const sats = buf[gps + 12];
    const spd = buf.readInt16BE(gps + 13);

    const ioOffset = gps + 15;
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
      raw_hex,
      crc_raw,
      crc_calc: crcCalc,
      status: statusOk
    };

    const collectionName = `trek_${year}`;
    const col = db.collection(collectionName);

    const q = { date, imei };
    const exists = await col.findOne(q);

    if (exists) {
      await col.updateOne(q, { $push: { data: record } });
    } else {
      await col.insertOne({ date, imei, data: [record] });
    }

    logToFile(`✅ [${imei}] Saved to ${collectionName} card=${card_id || 'none'} CRC=${statusOk}`);
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

      // перший пакет IMEI
      sock.once('data', data => {
        logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
        imei = cleanImei(data.toString());
        logToFile(`📡 IMEI parsed: ${imei}`);
        sendConfirmation(sock);

        // усі наступні пакети AVL
        sock.on('data', pkt => {
          decodeAvlData(pkt, imei, db);
          sendConfirmation(sock);
        });

        sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
        sock.on('error', e => logToFile(`⚠️ Socket error: ${e.message}`));
      });
    });

    server.listen(PORT, HOST, () =>
      logToFile(`🚀 TCP server listening on ${HOST}:${PORT}`)
    );
  } catch (e) {
    logToFile(`💥 Fatal error: ${e.message}`);
  }
}

start();
