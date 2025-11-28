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
//   } catch {}
//   return { ioMap };
// }

// // === CRC16 Teltonika ===
// function crc16Teltonika(buf) {
//   let crc = 0x0000;
//   for (const b of buf) {
//     crc ^= b;
//     for (let i = 0; i < 8; i++) {
//       if (crc & 0x0001) crc = (crc >> 1) ^ 0xA001;
//       else crc >>= 1;
//     }
//   }
//   return crc & 0xFFFF;
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

//     // === CRC ===
//     let crc = {
//       raw_bytes: null,
//       calculated: null,
//       valid: false
//     };

//     try {
//       const avl_data_len = buf.length - 4;
//       const avl_bytes = buf.slice(0, avl_data_len);
//       const crc_packet_bytes = buf.slice(buf.length - 4);
//       const crc_packet = crc_packet_bytes.readUInt32BE(0);
//       const crc_calc16 = crc16Teltonika(avl_bytes);
//       const crc_calc_full = (0 << 16) | crc_calc16;

//       crc.raw_bytes = crc_packet_bytes.toString('hex').toUpperCase();
//       crc.calculated = crc_calc_full.toString(16).padStart(8, '0').toUpperCase();
//       crc.valid = crc_packet === crc_calc_full;

//       logToFile(`🔹 CRC RAW BYTES: ${crc.raw_bytes}`);
//       logToFile(`🔹 CRC CALC (with 0000 prefix): ${crc.calculated}`);
//       logToFile(`🔹 CRC CHECK: ${crc.valid ? '✅' : '❌'}`);
//     } catch (e) {
//       logToFile(`⚠️ CRC calculation error: ${e.message}`);
//     }

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
//       raw_hex,
//       crc
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

// // === CRC16 Teltonika (Modbus) ===
// function crc16Teltonika(buf) {
//   let crc = 0x0000;
//   for (const b of buf) {
//     crc ^= b;
//     for (let i = 0; i < 8; i++) {
//       if (crc & 0x0001) crc = (crc >> 1) ^ 0xA001;
//       else crc >>= 1;
//     }
//   }
//   return crc & 0xFFFF;
// }

// // === Decode AVL & calculate CRC like Python ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     if (buf.length < 34) {
//       logToFile(`⚠️ Packet too short (${buf.length} bytes) from ${imei}`);
//       return;
//     }

//     const raw_hex = buf.toString('hex');
//     logToFile(`📦 RAW HEX (${imei}): ${raw_hex}`);

//     // --- Calculate CRC exactly like Python ---
//     let crc = {
//       raw_bytes: null,
//       calculated: null,
//       valid: false
//     };

//     try {
//       // --- Get dat_len from bytes 8..15 ---
//       const dat_len_hex = raw_hex.slice(8, 16);
//       const dat_len = parseInt(dat_len_hex, 16);

//       // --- AVL bytes for CRC: after preamble + dat_len (8+8 bytes) ---
//       const avl_start = 16;
//       const avl_bytes = Buffer.from(raw_hex.slice(avl_start, avl_start + dat_len * 2), 'hex');

//       // --- CRC bytes from the end of packet ---
//       const crc_bytes_raw = Buffer.from(raw_hex.slice(-8), 'hex');
//       const crc_packet = crc_bytes_raw.readUInt32BE(0);

//       // --- CRC calculation ---
//       const crc_calc16 = crc16Teltonika(avl_bytes);
//       const crc_calc_full = parseInt(`0000${crc_calc16.toString(16).padStart(4, '0')}`, 16);

//       crc.raw_bytes = crc_bytes_raw.toString('hex').toUpperCase();
//       crc.calculated = crc_calc_full.toString(16).padStart(8, '0').toUpperCase();
//       crc.valid = crc_packet === crc_calc_full;

//       logToFile(`🔹 CRC RAW BYTES: ${crc.raw_bytes}`);
//       logToFile(`🔹 CRC CALC (with 0000 prefix): ${crc.calculated}`);
//       logToFile(`🔹 CRC CHECK: ${crc.valid ? '✅' : '❌'}`);
//     } catch (e) {
//       crc = { raw_bytes: raw_hex.slice(-8).toUpperCase(), calculated: '', valid: false, error: e.message };
//       logToFile(`⚠️ CRC calculation error: ${e.message}`);
//     }

//     // --- Timestamp for DB ---
//     let ts = 0;
//     try { ts = Number(buf.readBigUInt64BE(10)) / 1000; } catch {}
//     const dt = new Date(ts * 1000);

//     const record = {
//       timestamp: dt,
//       raw_hex,
//       crc
//     };

//     const year = dt.getFullYear();
//     const col = db.collection(`trek_${year}`);
//     const q = { date: dt.toISOString().split('T')[0], imei };
//     const exists = await col.findOne(q);
//     if (exists) {
//       await col.updateOne(q, { $push: { data: record } });
//     } else {
//       await col.insertOne({ date: dt.toISOString().split('T')[0], imei, data: [record] });
//     }

//     logToFile(`✅ [${imei}] Saved to DB collection trek_${year}`);

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
//           // --- First packet: IMEI ---
//           if (!imei) {
//             logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
//             imei = cleanImei(data.toString());
//             logToFile(`📡 IMEI parsed: ${imei}`);
//             sendConfirmation(sock);
//             return;
//           }

//           // --- AVL packet ---
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









// server_teltonika_parser.js
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
  // Teltonika expects 0x01 (ACK) after IMEI and after AVL
  socket.write(Buffer.from([0x01]));
}

// CRC16 Modbus (IBM) implementation
function crc16Teltonika(buf) {
  let crc = 0x0000;
  for (let pos = 0; pos < buf.length; pos++) {
    crc ^= buf[pos];
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x0001) !== 0) {
        crc = (crc >> 1) ^ 0xA001;
      } else {
        crc = crc >> 1;
      }
    }
  }
  return crc & 0xFFFF;
}

// Parse AVL (Codec 8) fully
function parseAvlBuffer(avlBuf) {
  const result = {
    codec: null,
    records_count: 0,
    records: []
  };

  if (!avlBuf || avlBuf.length < 2) {
    throw new Error('AVL buffer too short');
  }

  let offset = 0;
  result.codec = avlBuf.readUInt8(offset); offset += 1;
  result.records_count = avlBuf.readUInt8(offset); offset += 1;

  // iterate records_count times
  for (let r = 0; r < result.records_count; r++) {
    if (offset + 8 > avlBuf.length) throw new Error('Unexpected EOF while reading timestamp');
    const timestampMs = Number(avlBuf.readBigUInt64BE(offset)); offset += 8;
    // Timestamp provided by device is in milliseconds since epoch
    const timestamp = new Date(timestampMs);

    if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading priority');
    const priority = avlBuf.readUInt8(offset); offset += 1;

    // GPS data
    if (offset + 4 + 4 + 2 + 2 + 1 + 2 > avlBuf.length) throw new Error('Unexpected EOF while reading GPS block');
    const lonRaw = avlBuf.readInt32BE(offset); offset += 4;
    const latRaw = avlBuf.readInt32BE(offset); offset += 4;
    const altitude = avlBuf.readInt16BE(offset); offset += 2;
    const angle = avlBuf.readUInt16BE(offset); offset += 2;
    const satellites = avlBuf.readUInt8(offset); offset += 1;
    const speed = avlBuf.readUInt16BE(offset); offset += 2;

    // Convert coords (Teltonika: 1e-7)
    const lon = lonRaw / 1e7;
    const lat = latRaw / 1e7;

    if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading event_id');
    const eventId = avlBuf.readUInt8(offset); offset += 1;

    if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading io_count header');
    // IO elements counts
    const io = { '1B': {}, '2B': {}, '4B': {}, '8B': {} };

    // 1-byte IO
    const oneByteCount = avlBuf.readUInt8(offset); offset += 1;
    for (let i = 0; i < oneByteCount; i++) {
      if (offset + 1 + 1 > avlBuf.length) throw new Error('Unexpected EOF in 1B IO elements');
      const id = avlBuf.readUInt8(offset); offset += 1;
      const val = avlBuf.readInt8(offset); offset += 1; // signed 1B
      io['1B'][id] = val;
    }

    // 2-byte IO
    const twoByteCount = avlBuf.readUInt8(offset); offset += 1;
    for (let i = 0; i < twoByteCount; i++) {
      if (offset + 1 + 2 > avlBuf.length) throw new Error('Unexpected EOF in 2B IO elements');
      const id = avlBuf.readUInt8(offset); offset += 1;
      const val = avlBuf.readInt16BE(offset); offset += 2; // signed 2B
      io['2B'][id] = val;
    }

    // 4-byte IO
    const fourByteCount = avlBuf.readUInt8(offset); offset += 1;
    for (let i = 0; i < fourByteCount; i++) {
      if (offset + 1 + 4 > avlBuf.length) throw new Error('Unexpected EOF in 4B IO elements');
      const id = avlBuf.readUInt8(offset); offset += 1;
      const val = avlBuf.readInt32BE(offset); offset += 4; // signed 4B (could be unsigned depending on sensor)
      io['4B'][id] = val;
    }

    // 8-byte IO
    const eightByteCount = avlBuf.readUInt8(offset); offset += 1;
    for (let i = 0; i < eightByteCount; i++) {
      if (offset + 1 + 8 > avlBuf.length) throw new Error('Unexpected EOF in 8B IO elements');
      const id = avlBuf.readUInt8(offset); offset += 1;
      const valBig = avlBuf.readBigInt64BE(offset); offset += 8; // signed 8B
      // convert BigInt to Number if safe, otherwise keep string
      const val = (valBig <= BigInt(Number.MAX_SAFE_INTEGER) && valBig >= BigInt(Number.MIN_SAFE_INTEGER))
        ? Number(valBig)
        : valBig.toString();
      io['8B'][id] = val;
    }

    // Push record
    result.records.push({
      timestamp: timestamp,
      priority,
      gps: {
        lon,
        lat,
        altitude,
        angle,
        satellites,
        speed
      },
      eventId,
      io
    });
  }

  // After records, next byte should be number of records again
  if (offset + 1 <= avlBuf.length) {
    const recsDup = avlBuf.readUInt8(offset); offset += 1;
    // optional: verify matches result.records_count
    if (recsDup !== result.records_count) {
      result.records_count_dup = recsDup;
      result.records_count_mismatch = true;
    }
  }

  return result;
}

// === Decode AVL & calculate CRC and save parsed AVL ===
async function decodeAvlData(buf, imei, db) {
  try {
    if (!Buffer.isBuffer(buf) || buf.length < 13) {
      logToFile(`⚠️ Packet too short (${buf.length}) from ${imei}`);
      return;
    }

    // --- Full raw hex ---
    const raw_hex = buf.toString('hex');
    logToFile(`📦 RAW HEX (${imei}): ${raw_hex}`);

    // --- Validate minimal structure: preamble(4) + dat_len(4) + at least codec(1) + rec_count(1) + crc(4) ---
    if (buf.length < 4 + 4 + 2 + 4) {
      logToFile(`⚠️ Packet unexpectedly short (structure) from ${imei}`);
      return;
    }

    // Read preamble
    const preamble = buf.slice(0, 4); // usually 0x00 0x00 0x00 0x00
    // Read dat_len (4 bytes, big-endian)
    const datLen = buf.readUInt32BE(4);

    // Check lengths
    const expectedTotal = 4 + 4 + datLen + 4;
    if (buf.length < expectedTotal) {
      logToFile(`⚠️ Buffer shorter than expected. dat_len=${datLen}, buf.length=${buf.length}, expectedTotal=${expectedTotal}`);
      // but proceed safely trying to parse available avl part
    }

    // AVL bytes are the next datLen bytes starting at offset 8
    const avlStart = 8;
    const avlEnd = avlStart + datLen;
    const avlBytes = buf.slice(avlStart, avlEnd);

    // CRC bytes are last 4 bytes (big-endian)
    const crcBytesRaw = buf.slice(avlEnd, avlEnd + 4);
    const crcPacket = crcBytesRaw.readUInt32BE(0);

    // Compute CRC16 over avlBytes and expand to 4-byte form like original code (prefix 0x0000)
    const crc16 = crc16Teltonika(avlBytes);
    const crcCalcFull = crc16 & 0xFFFF;
    // Represent calc as 32-bit big-endian value with upper 16 bits 0
    const crcCalcFull32 = crcCalcFull; // numeric
    // Format strings
    const crc_raw_hex = crcBytesRaw.toString('hex').toUpperCase();
    const crc_calc_hex = crcCalcFull32.toString(16).padStart(8, '0').toUpperCase();

    const crcValid = crcPacket === crcCalcFull32;

    logToFile(`🔹 dat_len: ${datLen}`);
    logToFile(`🔹 CRC RAW BYTES: ${crc_raw_hex}`);
    logToFile(`🔹 CRC CALC (with 0000 prefix): ${crc_calc_hex}`);
    logToFile(`🔹 CRC CHECK: ${crcValid ? '✅' : '❌'}`);

    // Parse AVL (Codec 8)
    let avlParsed = null;
    try {
      avlParsed = parseAvlBuffer(avlBytes);
      logToFile(`🔸 Parsed AVL codec ${avlParsed.codec}, records: ${avlParsed.records_count}`);
    } catch (e) {
      logToFile(`⚠️ AVL parse error: ${e.message}`);
      avlParsed = { error: e.message };
    }

    // --- Timestamp for DB --- pick first record timestamp if available, otherwise now
    let ts = Date.now();
    if (avlParsed && avlParsed.records && avlParsed.records.length > 0) {
      ts = avlParsed.records[0].timestamp.getTime();
    } else {
      // try reading 8 bytes at offset 10 like in your prior code (best-effort)
      try { ts = Number(buf.readBigUInt64BE(10)); } catch {}
    }
    const dt = new Date(Math.floor(ts));

    const record = {
      timestamp: dt,
      raw_hex,
      crc: {
        raw_bytes: crc_raw_hex,
        calculated: crc_calc_hex,
        valid: crcValid
      },
      avl: avlParsed
    };

    const year = dt.getFullYear();
    const col = db.collection(`trek_${year}`);
    const q = { date: dt.toISOString().split('T')[0], imei };
    const exists = await col.findOne(q);
    if (exists) {
      await col.updateOne(q, { $push: { data: record } });
    } else {
      await col.insertOne({ date: dt.toISOString().split('T')[0], imei, data: [record] });
    }

    logToFile(`✅ [${imei}] Saved parsed AVL to DB collection trek_${year}`);

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
          // --- First packet: IMEI (some devices send ASCII IMEI + newline) ---
          if (!imei) {
            logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
            // try to extract IMEI digits
            imei = cleanImei(data.toString());
            logToFile(`📡 IMEI parsed: ${imei}`);
            sendConfirmation(sock);
            return;
          }

          // --- AVL packet ---
          logToFile(`📥 AVL PACKET RAW (${imei}): ${data.toString('hex')}`);
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
