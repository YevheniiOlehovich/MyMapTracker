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

// // CRC16 Modbus (IBM)
// function crc16(buf) {
//   let crc = 0x0000;
//   for (let pos = 0; pos < buf.length; pos++) {
//     crc ^= buf[pos];
//     for (let i = 0; i < 8; i++) {
//       if ((crc & 0x0001) !== 0) {
//         crc = (crc >> 1) ^ 0xA001;
//       } else {
//         crc = crc >> 1;
//       }
//     }
//   }
//   return crc & 0xFFFF;
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

//     // === GPS parsing ===
//     const gpsOffset = 19;
//     const ts = Number(buf.readBigUInt64BE(10)) / 1000;
//     const dt = new Date(ts * 1000);

//     const lng = buf.readInt32BE(gpsOffset) / 1e7;
//     const lat = buf.readInt32BE(gpsOffset + 4) / 1e7;
//     const alt = buf.readInt16BE(gpsOffset + 8);
//     const ang = buf.readInt16BE(gpsOffset + 10);
//     const sats = buf[gpsOffset + 12];
//     const spd = buf.readInt16BE(gpsOffset + 13);

//     const { ioMap } = parseCodec8IO(buf, gpsOffset + 15);

//     let card_id = null;
//     if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
//       card_id = ioMap[157].hex.toLowerCase();
//     }

//     // --- CRC calculation & verification ---
//     let crcActual = null;
//     let crcValid = null;
//     let crcCalc = crc16(buf.slice(0, buf.length - 2)); // last 2 bytes as CRC

//     if (buf.length >= 2) {
//       crcActual = buf.readUInt16BE(buf.length - 2); // фактичне CRC з пакета
//       crcValid = crcCalc === crcActual;
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
//       raw_hex,
//       crc: {
//         calculated: crcCalc.toString(16).padStart(4, '0').toUpperCase(),
//         actual: crcActual !== null ? crcActual.toString(16).padStart(4, '0').toUpperCase() : null,
//         valid: crcValid
//       }
//     };

//     const collectionName = `trek_${dt.getFullYear()}`;
//     const col = db.collection(collectionName);
//     const q = { date: dt.toISOString().split('T')[0], imei };

//     const exists = await col.findOne(q);
//     if (exists) {
//       await col.updateOne(q, { $push: { data: record } });
//     } else {
//       await col.insertOne({ date: dt.toISOString().split('T')[0], imei, data: [record] });
//     }

//     logToFile(`✅ [${imei}] Saved to ${collectionName} card=${card_id || 'none'} | CRC calculated=${record.crc.calculated} actual=${record.crc.actual} status=${crcValid ? '✅' : '❌'}`);

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
//           if (!imei) {
//             logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
//             imei = cleanImei(data.toString());
//             logToFile(`📡 IMEI parsed: ${imei}`);
//             sendConfirmation(sock);
//             return;
//           }

//           logToFile(`📥 AVL PACKET RAW (${imei}): ${data.toString('hex')}`);
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

// === CRC16/X25 (для Bitrek) ===
function crc16x25(buffer) {
  let crc = 0xFFFF;

  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) crc = (crc >>> 1) ^ 0x8408;
      else crc >>>= 1;
    }
  }

  crc = ~crc & 0xFFFF;
  return ((crc << 8) & 0xFF00) | (crc >> 8);
}

// === IO parser (Codec 8) ===
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

    // --- Timestamp ---
    const ts = Number(buf.readBigUInt64BE(10)) / 1000;
    const dt = new Date(ts * 1000);

    const gpsOffset = 19;
    const lng = buf.readInt32BE(gpsOffset) / 1e7;
    const lat = buf.readInt32BE(gpsOffset + 4) / 1e7;
    const alt = buf.readInt16BE(gpsOffset + 8);
    const ang = buf.readInt16BE(gpsOffset + 10);
    const sats = buf[gpsOffset + 12];
    const spd = buf.readInt16BE(gpsOffset + 13);

    const { ioMap, eventId } = parseCodec8IO(buf, gpsOffset + 15);

    let card_id = null;
    if (ioMap[157] && !/^0+$/.test(ioMap[157].value)) {
      card_id = ioMap[157].value;
    }

    // --- CRC ---
    const crcCalc = crc16x25(buf.slice(0, buf.length - 2));
    const crcActual = buf.readUInt16BE(buf.length - 2);
    const crcValid = crcCalc === crcActual;

    // --- Logging with packet timestamp ---
    logToFile(`📅 DATE: ${dt.toISOString()}`);
    logToFile(`📦 RAW HEX (${imei}): ${rawHex}`);
    logToFile(`📏 LENGTH: ${len} bytes`);
    logToFile(`🧩 DECODED (${imei}): lat=${lat} lng=${lng} alt=${alt} speed=${spd} angle=${ang} sats=${sats}`);
    logToFile(`🔧 IO EVENT=${eventId} IO COUNT=${Object.keys(ioMap).length} CARD=${card_id || 'none'}`);
    logToFile(`🔐 CRC: calculated=${crcCalc.toString(16).toUpperCase()} actual=${crcActual.toString(16).toUpperCase()} VALID=${crcValid ? '✔' : '❌'}`);

    // --- DB save ---
    const collectionName = `trek_${dt.getFullYear()}`;
    const col = db.collection(collectionName);
    const key = { date: dt.toISOString().split('T')[0], imei };

    const record = {
      timestamp: dt,
      latitude: lat,
      longitude: lng,
      altitude: alt,
      angle: ang,
      satellites: sats,
      speed: spd,
      io: ioMap,
      eventId,
      card_id,
      raw: rawHex,
      crc: {
        calculated: crcCalc,
        actual: crcActual,
        valid: crcValid
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






