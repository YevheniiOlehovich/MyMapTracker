// //Більш-менш робочий білд
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
function crc16_teltonika(buf) {
  let crc = 0x0000;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x0001) ? (crc >>> 1) ^ 0xA001 : crc >>> 1;
    }
  }
  return crc;
}

// === Parse Codec 8 IO ===
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

    // --- Dat_len і виділення AVL ---
    const datLen = buf.readUInt32BE(4);
    const avlStart = 8;
    const avlEnd = avlStart + datLen;
    const avlBuf = buf.slice(avlStart, avlEnd);

    // --- CRC ---
    const crcCalc = crc16_teltonika(avlBuf); // 2 байти CRC16
    const crcPacket = buf.readUInt16BE(buf.length - 2); // останні 2 байти з 4-байтного поля CRC у пакеті
    const crcValidFlag = crcCalc === crcPacket ? 1 : 0;

    // --- Timestamp ---
    const ts = Number(avlBuf.readBigUInt64BE(2)) / 1000;
    const dt = new Date(ts * 1000);

    // --- GPS ---
    const gpsOffset = 11;
    const lng = avlBuf.readInt32BE(gpsOffset) / 1e7;
    const lat = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
    const alt = avlBuf.readInt16BE(gpsOffset + 8);
    const ang = avlBuf.readInt16BE(gpsOffset + 10);
    const sats = avlBuf[gpsOffset + 12];
    const spd = avlBuf.readInt16BE(gpsOffset + 13);

    const { ioMap, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);

    let card_id = null;
    if (ioMap[157] && !/^0+$/.test(ioMap[157].value)) {
      card_id = ioMap[157].value;
    }

    // --- Logging ---
    logToFile(`📅 DATE: ${dt.toISOString()}`);
    logToFile(`📦 RAW HEX (${imei}): ${rawHex}`);
    logToFile(`📏 LENGTH: ${len} bytes`);
    logToFile(`🧩 DECODED (${imei}): lat=${lat} lng=${lng} alt=${alt} speed=${spd} angle=${ang} sats=${sats}`);
    logToFile(`🔧 IO EVENT=${eventId} IO COUNT=${Object.keys(ioMap).length} CARD=${card_id || 'none'}`);
    logToFile(`🔐 CRC: calculated=${crcCalc.toString(16).toLowerCase()} packet=${crcPacket.toString(16).toLowerCase()} VALID=${crcValidFlag}`);

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
        calculated: crcCalc.toString(16).toLowerCase(),
        packet: crcPacket.toString(16).toLowerCase(),
        valid: crcValidFlag
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


// // server.js — оновлений сервер з валідацією timestamp/coords, ігноруванням 0/0, та маркуванням аномалій
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

// // === In-memory state ===
// const lastValidPointMap = new Map();   // imei -> { timestamp: Date, latitude, longitude, rawRecord }
// const suspiciousBuffer = new Map();    // imei -> [records]

// // === Helpers ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // CRC16 (Teltonika-style)
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

// // Parse Codec8 IO (existing logic)
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

// /**
//  * Try to get last saved point from DB for IMEI (search recent years)
//  */
// async function getLastSavedPoint(db, imei) {
//   const nowYear = new Date().getFullYear();
//   for (let yearDelta = 0; yearDelta <= 2; yearDelta++) {
//     const year = nowYear - yearDelta;
//     const colName = `trek_${year}`;
//     try {
//       const col = db.collection(colName);
//       const doc = await col.findOne({ imei }, { sort: { date: -1 }, projection: { data: { $slice: -1 } } });
//       if (doc && doc.data && doc.data.length) {
//         return doc.data[0];
//       }
//     } catch (e) {
//       // ignore missing collections / errors and continue
//     }
//   }
//   return null;
// }

// // Geo rules for Ukraine (adjust if needed)
// function isLatInUA(lat) { return lat >= 44 && lat <= 52.5; }
// function isLonInUA(lon) { return lon >= 22 && lon <= 41.5; }
// function isCoordsInUA(lat, lon) { return isLatInUA(lat) && isLonInUA(lon); }

// // Thresholds (adjustable)
// const MAX_HISTORY_MS = 7 * 24 * 3600 * 1000;   // allow packets from device buffer up to 7 days old
// const MAX_FUTURE_MS = 10 * 60 * 1000;          // allow up to +10 minutes into future
// const MAX_PAST_MS = 14 * 24 * 3600 * 1000;     // reject extremely old >14 days
// const GPS_JUMP_INVALID_DEG = 5;                // >5° => invalid
// const GPS_JUMP_SUSPICIOUS_DEG = 0.5;           // >0.5° => suspicious
// const MIN_SATELLITES = 3;
// const MAX_SPEED_KMH = 250;

// /**
//  * Timestamp range check
//  */
// const TIME_OFFSET_MS = 2 * 60 * 60 * 1000; // 2 години

// function isTimestampInAcceptableRange(tsMs) {
//   const now = Date.now() + TIME_OFFSET_MS;

//   if (tsMs < now - MAX_PAST_MS) return false;
//   if (tsMs > now + MAX_FUTURE_MS) return false;

//   return true;
// }

// /**
//  * classifyPoint returns one of:
//  *   'valid' | 'suspicious' | 'invalid' | 'ignore'
//  * - ignore = lat===0 && lng===0 (GPS not fixed) -> don't save
//  */
// function classifyPoint({ lat, lng, sats, speedKmh, tsMs }, lastValid) {
//   // ignore 0/0 — GPS hasn't fixed
//   if ((lat === 0 && lng === 0) || lat === 0.0 && lng === 0.0) return 'ignore';

//   // invalid if non-numeric
//   if (!Number.isFinite(lat) || !Number.isFinite(lng)) return 'invalid';

//   // reject wildly impossible coordinates
//   if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return 'invalid';

//   // timestamp absolute limits
//   if (!isTimestampInAcceptableRange(tsMs)) return 'invalid';

//   // very low satellites — mark suspicious/invalid
//   if (sats != null && sats <= 0) return 'invalid';
//   if (sats != null && sats < MIN_SATELLITES) {
//     // keep going — may still be suspicious not invalid
//   }

//   // If no lastValid — treat first available reasonably
//   if (!lastValid) {
//     if (!isCoordsInUA(lat, lng)) return 'suspicious'; // first point outside UA -> suspicious
//     if (sats != null && sats < MIN_SATELLITES) return 'suspicious';
//     return 'valid';
//   }

//   // have lastValid -> compute diffs
//   const latDiff = Math.abs(lat - lastValid.latitude);
//   const lonDiff = Math.abs(lng - lastValid.longitude);
//   const timeDiffSec = (tsMs - lastValid.timestamp.getTime()) / 1000;

//   // huge jump -> invalid
//   if (latDiff > GPS_JUMP_INVALID_DEG || lonDiff > GPS_JUMP_INVALID_DEG) return 'invalid';

//   // moderate jump -> suspicious
//   if (latDiff > GPS_JUMP_SUSPICIOUS_DEG || lonDiff > GPS_JUMP_SUSPICIOUS_DEG) return 'suspicious';

//   // time going back -> suspicious
//   if (timeDiffSec < -10) return 'suspicious';

//   // speed check
//   if (speedKmh != null && speedKmh > MAX_SPEED_KMH) return 'suspicious';

//   // coordinates outside UA but close -> suspicious
//   if (!isCoordsInUA(lat, lng)) return 'suspicious';

//   return 'valid';
// }

// /**
//  * Save record to DB same structure as original
//  */
// async function saveRecordToDb(db, dt, imei, record) {
//   const collectionName = `trek_${dt.getFullYear()}`;
//   const col = db.collection(collectionName);
//   const key = { date: dt.toISOString().split('T')[0], imei };

//   const exists = await col.findOne(key);
//   if (!exists) {
//     await col.insertOne({ ...key, data: [record] });
//   } else {
//     await col.updateOne(key, { $push: { data: record } });
//   }
// }

// // === Decode AVL with validation & anomaly handling ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     const rawHex = buf.toString('hex');
//     const len = buf.length;

//     // extract avl buffer according to codec packet (as in your code)
//     const datLen = buf.readUInt32BE(4);
//     const avlStart = 8;
//     const avlEnd = avlStart + datLen;
//     const avlBuf = buf.slice(avlStart, avlEnd);

//     // CRC
//     const crcCalc = crc16_tellonika(avlBuf);
//     const crcPacket = buf.readUInt16BE(buf.length - 2);
//     const crcValidFlag = crcCalc === crcPacket ? 1 : 0;

//     // timestamp
//     const ts = Number(avlBuf.readBigUInt64BE(2)) / 1000;
//     const dt = new Date(ts * 1000);
//     const tsMs = dt.getTime();

//     // GPS fields (offsets as before)
//     const gpsOffset = 11;
//     const lng = avlBuf.readInt32BE(gpsOffset) / 1e7;
//     const lat = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
//     const alt = avlBuf.readInt16BE(gpsOffset + 8);
//     const ang = avlBuf.readInt16BE(gpsOffset + 10);
//     const sats = avlBuf[gpsOffset + 12];
//     const spdRaw = avlBuf.readInt16BE(gpsOffset + 13);
//     const speedKmh = Number(spdRaw);

//     const { ioMap, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);

//     let card_id = null;
//     if (ioMap[157] && !/^0+$/.test(ioMap[157].value)) {
//       card_id = ioMap[157].value;
//     }

//     // Logging decode
//     logToFile(`📅 PACKET DATE: ${dt.toISOString()}`);
//     logToFile(`📦 RAW HEX (${imei}): ${rawHex}`);
//     logToFile(`📏 LENGTH: ${len} bytes`);
//     logToFile(`🧩 DECODED (${imei}): lat=${lat} lng=${lng} alt=${alt} speed=${speedKmh} angle=${ang} sats=${sats}`);
//     logToFile(`🔧 IO EVENT=${eventId} IO COUNT=${Object.keys(ioMap).length} CARD=${card_id || 'none'}`);
//     logToFile(`🔐 CRC: calculated=${crcCalc.toString(16).toLowerCase()} packet=${crcPacket.toString(16).toLowerCase()} VALID=${crcValidFlag}`);

//     // prepare base record
//     const recordBase = {
//       timestamp: dt,
//       latitude: lat,
//       longitude: lng,
//       altitude: alt,
//       angle: ang,
//       satellites: sats,
//       speed: speedKmh,
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

//     // get lastValid from memory or DB
//     let lastValid = lastValidPointMap.get(imei);
//     if (!lastValid) {
//       const prev = await getLastSavedPoint(db, imei);
//       if (prev) {
//         lastValid = {
//           timestamp: prev.timestamp instanceof Date ? prev.timestamp : new Date(prev.timestamp),
//           latitude: prev.latitude,
//           longitude: prev.longitude,
//           rawRecord: prev
//         };
//         lastValidPointMap.set(imei, lastValid);
//       }
//     }

//     // classification
//     const cls = classifyPoint({ lat, lng, sats, speedKmh, tsMs }, lastValid);

//     // handle ignore
//     if (cls === 'ignore') {
//       logToFile(`⏭ IGNORED: GPS not fixed (0,0) for IMEI ${imei} — no save`);
//       return;
//     }

//     if (cls === 'valid') {
//       // save normal
//       await saveRecordToDb(db, dt, imei, recordBase);

//       // update lastValid
//       lastValidPointMap.set(imei, { timestamp: dt, latitude: lat, longitude: lng, rawRecord: recordBase });

//       // clear suspicious buffer if existed (mark resolved)
//       const buf = suspiciousBuffer.get(imei);
//       if (buf && buf.length) {
//         logToFile(`ℹ️ Suspicious buffer for ${imei} resolved (len=${buf.length})`);
//         suspiciousBuffer.set(imei, []);
//       }

//       logToFile(`✅ Saved VALID point for ${imei} ${lat},${lng} @ ${dt.toISOString()}`);
//       return;
//     }

//     if (cls === 'suspicious') {
//       const rec = {
//         ...recordBase,
//         anomaly: true,
//         anomalyType: 'SUSPICIOUS',
//         note: 'Coordinates/time suspicious compared to last valid point'
//       };

//       if (lastValid) {
//         rec.lastValid = {
//           timestamp: lastValid.timestamp,
//           latitude: lastValid.latitude,
//           longitude: lastValid.longitude
//         };
//       }

//       await saveRecordToDb(db, dt, imei, rec);

//       const sb = suspiciousBuffer.get(imei) || [];
//       sb.push(rec);
//       suspiciousBuffer.set(imei, sb);

//       logToFile(`⚠️ SAVED SUSPICIOUS for ${imei} (buffer=${sb.length}) lat=${lat} lon=${lng} ts=${dt.toISOString()}`);
//       return;
//     }

//     // cls === 'invalid'
//     const invalidRec = {
//       timestamp: dt,
//       anomaly: true,
//       anomalyType: 'INVALID',
//       originalLatitude: lat,
//       originalLongitude: lng,
//       altitude: alt,
//       angle: ang,
//       satellites: sats,
//       speed: speedKmh,
//       io: ioMap,
//       eventId,
//       card_id,
//       raw: rawHex,
//       crc: {
//         calculated: crcCalc.toString(16).toLowerCase(),
//         packet: crcPacket.toString(16).toLowerCase(),
//         valid: crcValidFlag
//       },
//       note: 'Invalid point — stored as anomaly. Coordinates replaced with last valid snapshot if available.'
//     };

//     if (lastValid) {
//       invalidRec.latitude = lastValid.latitude;
//       invalidRec.longitude = lastValid.longitude;
//       invalidRec.lastValid = {
//         timestamp: lastValid.timestamp,
//         latitude: lastValid.latitude,
//         longitude: lastValid.longitude
//       };
//     } else {
//       invalidRec.latitude = lat;
//       invalidRec.longitude = lng;
//     }

//     await saveRecordToDb(db, dt, imei, invalidRec);
//     logToFile(`⛔ SAVED INVALID for ${imei} original(${lat},${lng}) stored-as (${invalidRec.latitude},${invalidRec.longitude}) ts=${dt.toISOString()}`);

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
//         try {
//           if (!imei) {
//             logToFile(`📥 FIRST PACKET: ${data.toString('hex')}`);
//             imei = cleanImei(data.toString());
//             logToFile(`📡 IMEI = ${imei}`);
//             sendConfirmation(sock);
//             return;
//           }

//           logToFile(`📥 AVL: ${data.toString('hex')}`);
//           await decodeAvlData(data, imei, db);
//           sendConfirmation(sock);
//         } catch (err) {
//           logToFile(`⚠️ Handler error: ${err.message}`);
//         }
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
