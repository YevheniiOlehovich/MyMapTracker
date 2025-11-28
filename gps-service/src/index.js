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

// CRC16 Modbus (IBM)
function crc16(buf) {
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

    // === GPS parsing ===
    const gpsOffset = 19;
    const ts = Number(buf.readBigUInt64BE(10)) / 1000;
    const dt = new Date(ts * 1000);

    const lng = buf.readInt32BE(gpsOffset) / 1e7;
    const lat = buf.readInt32BE(gpsOffset + 4) / 1e7;
    const alt = buf.readInt16BE(gpsOffset + 8);
    const ang = buf.readInt16BE(gpsOffset + 10);
    const sats = buf[gpsOffset + 12];
    const spd = buf.readInt16BE(gpsOffset + 13);

    const { ioMap } = parseCodec8IO(buf, gpsOffset + 15);

    let card_id = null;
    if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
      card_id = ioMap[157].hex.toLowerCase();
    }

    // --- CRC calculation & verification ---
    let crcActual = null;
    let crcValid = null;
    let crcCalc = crc16(buf.slice(0, buf.length - 2)); // last 2 bytes as CRC

    if (buf.length >= 2) {
      crcActual = buf.readUInt16BE(buf.length - 2); // фактичне CRC з пакета
      crcValid = crcCalc === crcActual;
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
      crc: {
        calculated: crcCalc.toString(16).padStart(4, '0').toUpperCase(),
        actual: crcActual !== null ? crcActual.toString(16).padStart(4, '0').toUpperCase() : null,
        valid: crcValid
      }
    };

    const collectionName = `trek_${dt.getFullYear()}`;
    const col = db.collection(collectionName);
    const q = { date: dt.toISOString().split('T')[0], imei };

    const exists = await col.findOne(q);
    if (exists) {
      await col.updateOne(q, { $push: { data: record } });
    } else {
      await col.insertOne({ date: dt.toISOString().split('T')[0], imei, data: [record] });
    }

    logToFile(`✅ [${imei}] Saved to ${collectionName} card=${card_id || 'none'} | CRC calculated=${record.crc.calculated} actual=${record.crc.actual} status=${crcValid ? '✅' : '❌'}`);

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
          if (!imei) {
            logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
            imei = cleanImei(data.toString());
            logToFile(`📡 IMEI parsed: ${imei}`);
            sendConfirmation(sock);
            return;
          }

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






// server_teltonika_full.js
// const net = require('net');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');
// const path = require('path');

// // === Settings ===
// const HOST = '0.0.0.0';
// const PORT = 20120;
// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';

// // === Logs (file + console) ===
// const LOG_DIR = path.join(__dirname, 'logs');
// if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// function logToFile(message) {
//   const date = new Date().toISOString().split('T')[0];
//   const file = path.join(LOG_DIR, `${date}.log`);
//   fs.appendFileSync(file, `[${new Date().toISOString()}] ${message}\n`);
//   console.log(message);
// }

// // === DB ===
// const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// // === Helpers ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// function sendConfirmation(socket, n = 1) {
//   // According to BITREK/Teltonika: send 4-byte BE confirmation.
//   // For IMEI ack (single byte expected by device) we still used earlier 0x01;
//   // but for AVL ack we should send 4 bytes representing number of records (BE).
//   // Here default simple ACK 0x01 single byte to keep compatibility for IMEI ack.
//   if (n === 'single') {
//     socket.write(Buffer.from([0x01]));
//   } else {
//     // send 4-byte BE integer - by default 1 (one record processed)
//     const buf = Buffer.alloc(4);
//     buf.writeUInt32BE(Number(n) || 0, 0);
//     socket.write(buf);
//   }
// }

// // CRC16 Modbus (Teltonika) implementation
// function crc16_teltonika(buf) {
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

// // === FULL AVL PARSER (Codec 8 / BITREK) ===
// function parseAvlPacket(packetBuf) {
//   // packetBuf is whole packet: preamble(4) + dat_len(4BE) + AVL(dat_len) + CRC(4BE)
//   if (!Buffer.isBuffer(packetBuf)) throw new Error('Expected Buffer');

//   if (packetBuf.length < 12) throw new Error('Packet too short');

//   // preamble (4) - usually 0x00 0x00 0x00 0x00
//   const preamble = packetBuf.slice(0, 4);

//   // dat_len (4 bytes BE)
//   const datLen = packetBuf.readUInt32BE(4);

//   const avlStart = 8;
//   const avlEnd = avlStart + datLen;

//   if (packetBuf.length < avlEnd + 4) {
//     throw new Error(`Packet shorter than expected for dat_len=${datLen}`);
//   }

//   const avlBuf = packetBuf.slice(avlStart, avlEnd);
//   const crcRawBuf = packetBuf.slice(avlEnd, avlEnd + 4); // 4 bytes BE (0000 + CRC16)
//   const crcActual32 = crcRawBuf.readUInt32BE(0);

//   const crcCalc16 = crc16_teltonika(avlBuf);
//   const crcCalcFull32 = crcCalc16 & 0xffff; // numeric (fits into 32-bit lower part)

//   // parse AVL
//   let offset = 0;
//   if (avlBuf.length < 2) throw new Error('AVL too short for codec and count');

//   const codec_id = avlBuf.readUInt8(offset); offset += 1;
//   const records_count = avlBuf.readUInt8(offset); offset += 1;

//   const records = [];

//   for (let r = 0; r < records_count; r++) {
//     if (offset + 8 > avlBuf.length) throw new Error('Unexpected EOF while reading timestamp');
//     const timestampMs = Number(avlBuf.readBigUInt64BE(offset)); offset += 8;
//     const timestamp = new Date(timestampMs);

//     if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading priority');
//     const priority = avlBuf.readUInt8(offset); offset += 1;

//     // GPS block (15 bytes)
//     if (offset + 15 > avlBuf.length) throw new Error('Unexpected EOF while reading GPS block');
//     const lonRaw = avlBuf.readInt32BE(offset); offset += 4;
//     const latRaw = avlBuf.readInt32BE(offset); offset += 4;
//     const altitude = avlBuf.readInt16BE(offset); offset += 2;
//     const angle = avlBuf.readUInt16BE(offset); offset += 2;
//     const satellites = avlBuf.readUInt8(offset); offset += 1;
//     const speed = avlBuf.readUInt16BE(offset); offset += 2;

//     const lon = lonRaw / 1e7;
//     const lat = latRaw / 1e7;

//     if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading eventId');
//     const eventId = avlBuf.readUInt8(offset); offset += 1;

//     if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading total IO');
//     const totalIO = avlBuf.readUInt8(offset); offset += 1;

//     // IO containers
//     const io = { '1B': {}, '2B': {}, '4B': {}, '8B': {} };

//     // 1-byte IO
//     if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading 1B count');
//     const n1 = avlBuf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < n1; i++) {
//       if (offset + 2 > avlBuf.length) throw new Error('Unexpected EOF in 1B IO elements');
//       const id = avlBuf.readUInt8(offset); offset += 1;
//       const val = avlBuf.readInt8(offset); offset += 1;
//       io['1B'][id] = val;
//     }

//     // 2-byte IO
//     if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading 2B count');
//     const n2 = avlBuf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < n2; i++) {
//       if (offset + 3 > avlBuf.length) throw new Error('Unexpected EOF in 2B IO elements');
//       const id = avlBuf.readUInt8(offset); offset += 1;
//       const val = avlBuf.readInt16BE(offset); offset += 2;
//       io['2B'][id] = val;
//     }

//     // 4-byte IO
//     if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading 4B count');
//     const n4 = avlBuf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < n4; i++) {
//       if (offset + 5 > avlBuf.length) throw new Error('Unexpected EOF in 4B IO elements');
//       const id = avlBuf.readUInt8(offset); offset += 1;
//       const val = avlBuf.readInt32BE(offset); offset += 4;
//       io['4B'][id] = val;
//     }

//     // 8-byte IO
//     if (offset + 1 > avlBuf.length) throw new Error('Unexpected EOF while reading 8B count');
//     const n8 = avlBuf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < n8; i++) {
//       if (offset + 9 > avlBuf.length) throw new Error('Unexpected EOF in 8B IO elements');
//       const id = avlBuf.readUInt8(offset); offset += 1;
//       const valBig = avlBuf.readBigInt64BE(offset); offset += 8;
//       const val = (valBig <= BigInt(Number.MAX_SAFE_INTEGER) && valBig >= BigInt(Number.MIN_SAFE_INTEGER)) ? Number(valBig) : valBig.toString();
//       io['8B'][id] = val;
//     }

//     // push parsed record
//     records.push({
//       timestamp,
//       priority,
//       gps: { lon, lat, altitude, angle, satellites, speed },
//       eventId,
//       totalIO,
//       io
//     });
//   }

//   // duplicated record count at end
//   let records_count_dup = null;
//   if (offset + 1 <= avlBuf.length) {
//     try {
//       records_count_dup = avlBuf.readUInt8(offset); offset += 1;
//     } catch (e) {
//       records_count_dup = null;
//     }
//   }

//   return {
//     preamble: preamble.toString('hex').toUpperCase(),
//     dat_len: datLen,
//     codec_id,
//     records_count,
//     records,
//     records_count_dup,
//     crc: {
//       raw: crcRawBuf.toString('hex').toUpperCase(),
//       actual: crcActual32.toString(16).padStart(8, '0').toUpperCase(),
//       calculated: crcCalc16.toString(16).padStart(4, '0').toUpperCase(),
//       valid: crcActual32 === crcCalc16
//     }
//   };
// }

// // === Decode AVL & save to DB ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     const raw_hex = buf.toString('hex');
//     logToFile(`📦 RAW HEX (${imei}): ${raw_hex}`);
//     let parsed;
//     try {
//       parsed = parseAvlPacket(buf);
//     } catch (e) {
//       logToFile(`⚠️ AVL parse error: ${e.message}`);
//       // still store raw packet with error
//       const dt = new Date();
//       const recordErr = {
//         timestamp: dt,
//         raw_hex,
//         parse_error: e.message
//       };
//       const colErr = db.collection(`trek_${dt.getFullYear()}`);
//       const qErr = { date: dt.toISOString().split('T')[0], imei };
//       const existsErr = await colErr.findOne(qErr);
//       if (existsErr) await colErr.updateOne(qErr, { $push: { data: recordErr } });
//       else await colErr.insertOne({ date: dt.toISOString().split('T')[0], imei, data: [recordErr] });
//       return;
//     }

//     // choose primary timestamp from first record if present, else now
//     let dt = new Date();
//     if (parsed.records && parsed.records.length > 0) dt = parsed.records[0].timestamp;

//     const record = {
//       timestamp: dt,
//       raw_hex,
//       avl: parsed
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

//     // log CRC status and basics
//     logToFile(`✅ [${imei}] Saved parsed AVL to trek_${year} | records=${parsed.records_count} | CRC calc=${parsed.crc.calculated} actual=${parsed.crc.actual} valid=${parsed.crc.valid ? '✅' : '❌'}`);

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
//       let isInitialized = false;

//       sock.on('data', async data => {
//         try {
//           // If not initialized, first packet is IMEI (15 ASCII bytes with leading length maybe)
//           if (!isInitialized) {
//             // Many devices send first packet as ASCII IMEI or length+IMEI.
//             logToFile(`📥 FIRST PACKET RAW: ${data.toString('hex')}`);
//             const maybeAscii = data.toString();
//             const cleaned = cleanImei(maybeAscii);
//             if (cleaned && cleaned.length >= 10) {
//               imei = cleaned;
//               isInitialized = true;
//               logToFile(`📡 IMEI parsed: ${imei}`);
//               // send single byte ack for init
//               sendConfirmation(sock, 'single');
//               return;
//             }
//             // fallback: still treat as IMEI
//             imei = cleaned || '';
//             isInitialized = true;
//             sendConfirmation(sock, 'single');
//             return;
//           }

//           // --- AVL packet ---
//           logToFile(`📥 AVL PACKET RAW (${imei}): ${data.toString('hex')}`);
//           await decodeAvlData(data, imei, db);

//           // For simplicity we respond with number of parsed records (4 bytes BE)
//           // Try to read dat_len -> avl -> parsed to get count
//           try {
//             const parsed = parseAvlPacket(data);
//             sendConfirmation(sock, parsed.records_count);
//           } catch {
//             // on parse error send 0
//             sendConfirmation(sock, 0);
//           }

//         } catch (err) {
//           logToFile(`❌ Socket data handler error: ${err.message}`);
//         }
//       });

//       sock.on('close', () => logToFile(`🔴 Disconnected: ${imei}`));
//       sock.on('error', e => logToFile(`⚠️ Socket error: ${e.message}`));
//     });

//     server.listen(PORT, HOST, () => logToFile(`🚀 Listening TCP ${HOST}:${PORT}`));
//   } catch (e) {
//     logToFile(`💥 Fatal: ${e.message}`);
//     process.exit(1);
//   }
// }

// start();
