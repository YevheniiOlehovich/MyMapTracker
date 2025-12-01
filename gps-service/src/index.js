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

// // === CRC16 Teltonika ===
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

// // === Parse Codec 8 IO ===
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

// // === Decode AVL ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     const rawHex = buf.toString('hex');
//     const len = buf.length;

//     // --- Dat_len і виділення AVL ---
//     const datLen = buf.readUInt32BE(4);
//     const avlStart = 8;
//     const avlEnd = avlStart + datLen;
//     const avlBuf = buf.slice(avlStart, avlEnd);

//     // --- CRC ---
//     const crcCalc = crc16_teltonika(avlBuf); // 2 байти CRC16
//     const crcPacket = buf.readUInt16BE(buf.length - 2); // останні 2 байти з 4-байтного поля CRC у пакеті
//     const crcValidFlag = crcCalc === crcPacket ? 1 : 0;

//     // --- Timestamp ---
//     const ts = Number(avlBuf.readBigUInt64BE(2)) / 1000;
//     const dt = new Date(ts * 1000);

//     // --- GPS ---
//     const gpsOffset = 11;
//     const lng = avlBuf.readInt32BE(gpsOffset) / 1e7;
//     const lat = avlBuf.readInt32BE(gpsOffset + 4) / 1e7;
//     const alt = avlBuf.readInt16BE(gpsOffset + 8);
//     const ang = avlBuf.readInt16BE(gpsOffset + 10);
//     const sats = avlBuf[gpsOffset + 12];
//     const spd = avlBuf.readInt16BE(gpsOffset + 13);

//     const { ioMap, eventId } = parseCodec8IO(avlBuf, gpsOffset + 15);

//     let card_id = null;
//     if (ioMap[157] && !/^0+$/.test(ioMap[157].value)) {
//       card_id = ioMap[157].value;
//     }

//     // --- Logging ---
//     logToFile(`📅 DATE: ${dt.toISOString()}`);
//     logToFile(`📦 RAW HEX (${imei}): ${rawHex}`);
//     logToFile(`📏 LENGTH: ${len} bytes`);
//     logToFile(`🧩 DECODED (${imei}): lat=${lat} lng=${lng} alt=${alt} speed=${spd} angle=${ang} sats=${sats}`);
//     logToFile(`🔧 IO EVENT=${eventId} IO COUNT=${Object.keys(ioMap).length} CARD=${card_id || 'none'}`);
//     logToFile(`🔐 CRC: calculated=${crcCalc.toString(16).toLowerCase()} packet=${crcPacket.toString(16).toLowerCase()} VALID=${crcValidFlag}`);

//     // --- DB save ---
//     const collectionName = `trek_${dt.getFullYear()}`;
//     const col = db.collection(collectionName);
//     const key = { date: dt.toISOString().split('T')[0], imei };

//     const record = {
//       timestamp: dt,
//       latitude: lat,
//       longitude: lng,
//       altitude: alt,
//       angle: ang,
//       satellites: sats,
//       speed: spd,
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

//     const exists = await col.findOne(key);
//     if (!exists) {
//       await col.insertOne({ ...key, data: [record] });
//     } else {
//       await col.updateOne(key, { $push: { data: record } });
//     }

//     logToFile(`✅ Saved to ${collectionName}`);
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
//         if (!imei) {
//           logToFile(`📥 FIRST PACKET: ${data.toString('hex')}`);
//           imei = cleanImei(data.toString());
//           logToFile(`📡 IMEI = ${imei}`);
//           sendConfirmation(sock);
//           return;
//         }

//         logToFile(`📥 AVL: ${data.toString('hex')}`);
//         await decodeAvlData(data, imei, db);
//         sendConfirmation(sock);
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


// server.js
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
//   try {
//     fs.appendFileSync(file, `[${new Date().toISOString()}] ${message}\n`);
//   } catch (e) {
//     console.error('Log write error:', e.message);
//   }
//   console.log(message);
// }

// // === DB ===
// const client = new MongoClient(MONGODB_URI);

// // === Helpers ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// function sendConfirmation(socket) {
//   try {
//     socket.write(Buffer.from([0x01]));
//   } catch (e) {
//     logToFile(`⚠️ sendConfirmation error: ${e.message}`);
//   }
// }

// // === CRC16 Teltonika ===
// function crc16_teltonika(buf) {
//   let crc = 0x0000;
//   for (let i = 0; i < buf.length; i++) {
//     crc ^= buf[i];
//     for (let j = 0; j < 8; j++) {
//       crc = (crc & 0x0001) ? (crc >>> 1) ^ 0xA001 : crc >>> 1;
//     }
//   }
//   return crc & 0xffff;
// }

// // === Parse Codec 8 IO ===
// function parseCodec8IO(buf, offset) {
//   const ioMap = {};
//   try {
//     // eventId и total IO count (обычно eventId один байт, totalIO — один байт)
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

// // === Decode AVL ===
// async function decodeAvlData(buf, imei, db) {
//   try {
//     const dataLen = buf.readUInt32BE(4);
//     const avlBuf = buf.slice(8, 8 + dataLen);

//     const codecId = avlBuf.readUInt8(0);
//     const recordCount = avlBuf.readUInt8(1);

//     let offset = 2;

//     for (let r = 0; r < recordCount; r++) {
//       // Timestamp
//       const ts = Number(avlBuf.readBigUInt64BE(offset)) / 1000;
//       offset += 8;

//       // Priority
//       offset++;

//       // GPS
//       const lng = avlBuf.readInt32BE(offset) / 1e7;
//       const lat = avlBuf.readInt32BE(offset+4) / 1e7;
//       const alt = avlBuf.readInt16BE(offset+8);
//       const ang = avlBuf.readInt16BE(offset+10);
//       const sats = avlBuf[offset+12];
//       const spd = avlBuf.readInt16BE(offset+13);
//       offset += 15;

//       // IO
//       const { ioMap, eventId } = parseCodec8IO(avlBuf, offset);
//       offset += (
//         2 + // eventID, totalIO
//         1 + Object.keys(ioMap).filter(k=>ioMap[k].size===1).length*2 +
//         1 + Object.keys(ioMap).filter(k=>ioMap[k].size===2).length*3 +
//         1 + Object.keys(ioMap).filter(k=>ioMap[k].size===4).length*5 +
//         1 + Object.keys(ioMap).filter(k=>ioMap[k].size===8).length*9
//       );

//       let card_id = null;
//       if (ioMap[157] && !/^0+$/.test(ioMap[157].value)) {
//         card_id = ioMap[157].value;
//       }

//       const dt = new Date(ts * 1000);

//       const collectionName = `trek_${dt.getFullYear()}`;
//       const col = db.collection(collectionName);
//       const key = { date: dt.toISOString().slice(0,10), imei };

//       const record = {
//         timestamp: dt,
//         latitude: lat,
//         longitude: lng,
//         altitude: alt,
//         angle: ang,
//         satellites: sats,
//         speed: spd,
//         io: ioMap,
//         eventId,
//         card_id
//       };

//       const exists = await col.findOne(key);
//       if (!exists) {
//         await col.insertOne({ ...key, data: [record] });
//       } else {
//         await col.updateOne(key, { $push: { data: record } });
//       }

//       logToFile(`📌 Saved AVL record #${r+1}/${recordCount}`);
//     }

//   } catch (e) {
//     logToFile(`❌ decodeAvlData error: ${e.message}`);
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

//       let imei = null;
//       let buffer = Buffer.alloc(0);

//       sock.on('data', async data => {
//         try {
//           // Додаємо байти в локальний буфер
//           buffer = Buffer.concat([buffer, data]);

//           // Якщо IMEI ще немає — спробуємо його витягти
//           if (!imei) {
//             // Спочатку пробуємо формат: 2 байти довжини + ASCII IMEI
//             if (buffer.length >= 2) {
//               const possibleLen = buffer.readUInt16BE(0);
//               if (possibleLen > 0 && possibleLen < 64 && buffer.length >= 2 + possibleLen) {
//                 const imeiBuf = buffer.slice(2, 2 + possibleLen);
//                 const got = imeiBuf.toString('ascii');
//                 const cleaned = cleanImei(got);
//                 if (cleaned.length >= 10) {
//                   imei = cleaned;
//                   logToFile(`📡 IMEI (len-prefixed) = ${imei}`);
//                   sendConfirmation(sock);
//                   buffer = buffer.slice(2 + possibleLen); // видаляємо IMEI
//                 }
//               }
//             }

//             // Якщо ще нема, пробуємо знайти ASCII послідовність цифр у буфері (інша реалізація IMEI)
//             if (!imei) {
//               const ascii = buffer.toString('ascii');
//               const match = ascii.match(/(\d{10,20})/);
//               if (match) {
//                 imei = cleanImei(match[1]);
//                 logToFile(`📡 IMEI (ascii found) = ${imei}`);
//                 sendConfirmation(sock);
//                 // вирізати те, що сприйняли як IMEI з буфера
//                 const idx = ascii.indexOf(match[1]);
//                 buffer = buffer.slice(idx + match[1].length);
//               }
//             }

//             // Якщо досі немає — просто чекаємо наступних байтів
//             if (!imei) {
//               return;
//             }
//           }

//           // === Тепер обробляємо AVL пакети у циклі, поки в буфері є повні пакети ===
//           while (buffer.length >= 12) {
//             // Перевіряємо початок: 4 нулі
//             if (!(buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 0 && buffer[3] === 0)) {
//               // Якщо починається не з 4 нулів — відкидаємо перший байт
//               logToFile("⚠️ Invalid AVL header (no 4 leading zeros), dropping 1 byte");
//               buffer = buffer.slice(1);
//               continue;
//             }

//             // Переконаємось, що є 8 байт заголовку для читання datLen
//             if (buffer.length < 8) break;
//             const dataLen = buffer.readUInt32BE(4);

//             // Повна довжина пакета: 8 (header) + dataLen (AVL data) + 4 (crc/records)
//             const fullPacketLen = 8 + dataLen + 4;

//             if (buffer.length < fullPacketLen) {
//               // Пакет ще не повний, чекаємо
//               break;
//             }

//             // Витягуємо повний пакет і обрізаємо з буфера
//             const packet = buffer.slice(0, fullPacketLen);
//             buffer = buffer.slice(fullPacketLen);

//             logToFile(`📥 Full AVL packet: ${packet.toString('hex').slice(0, 400)}${packet.length > 400 ? '... (truncated)' : ''}`);

//             // Декодуємо один повний пакет (один виклик decodeAvlData)
//             await decodeAvlData(packet, imei, db);

//             // Відправляємо підтвердження (за протоколом)
//             sendConfirmation(sock);
//           }

//         } catch (err) {
//           logToFile(`❌ TCP parse error: ${err.message}`);
//         }
//       });

//       sock.on('close', () => logToFile(`🔴 Disconnected: ${imei || 'unknown'}`));
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



























// server.js
const net = require('net');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// === Налаштування ===
const HOST = '0.0.0.0';
const PORT = 20120;
const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
const DATABASE_NAME = 'test';
const COLLECTION_NAME = 'avl_records';

// === Папка для логів ===
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// === Логування ===
function logToFile(message) {
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOG_DIR, `${date}.log`);
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  console.log(message);
}

// === MongoDB клієнт ===
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// === Логіка обмеження пакетів ===
const packetTracker = {};
const MAX_PACKETS = 3;
const TIME_WINDOW = 60 * 1000; // 1 хвилина

function shouldStorePacket(imei, packetHex) {
  const now = Date.now();
  if (!packetTracker[imei]) packetTracker[imei] = [];

  // Очищаємо старі пакети
  packetTracker[imei] = packetTracker[imei].filter(p => now - p.timestamp < TIME_WINDOW);

  if (packetTracker[imei].length >= MAX_PACKETS) {
    return false;
  }

  // Додаємо новий пакет
  packetTracker[imei].push({ hex: packetHex, timestamp: now });
  return true;
}

// === Допоміжні функції ===
function cleanImei(imei) {
  return imei.replace(/\D/g, '');
}

function sendConfirmation(socket) {
  socket.write(Buffer.from([0x01]));
}

// === Парсер IO ===
function parseCodec8IO(buf, ioOffset) {
  let offset = ioOffset;
  const ioMap = {};

  if (offset >= buf.length) return { ioMap, nextOffset: offset };

  try {
    offset += 1; // eventId
    const totalIO = buf.readUInt8(offset); offset += 1;

    const readIO = (count, size) => {
      const map = {};
      for (let i = 0; i < count; i++) {
        const id = buf.readUInt8(offset); offset += 1;
        const valBuf = buf.slice(offset, offset + size); offset += size;
        map[id] = { size, hex: valBuf.toString('hex') };
      }
      return map;
    };

    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 1));
    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 2));
    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 4));
    Object.assign(ioMap, readIO(buf.readUInt8(offset++), 8));

    return { ioMap, nextOffset: offset };
  } catch {
    return { ioMap, nextOffset: offset };
  }
}

// === Розбір AVL пакету ===
async function decodeAvlData(buffer, imei, collection) {
  try {
    if (buffer.length < 34) return logToFile(`⚠️ [${imei}] Packet too short`);

    const timestamp = Number(buffer.readBigUInt64BE(10)) / 1000;
    const timestampDate = new Date(timestamp * 1000);
    const date = timestampDate.toISOString().split('T')[0];

    const gpsDataOffset = 19;
    if (buffer.length < gpsDataOffset + 15) return logToFile(`⚠️ [${imei}] Packet too short for GPS`);

    const longitude = buffer.readInt32BE(gpsDataOffset) / 1e7;
    const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 1e7;
    const altitude = buffer.readInt16BE(gpsDataOffset + 8);
    const angle = buffer.readInt16BE(gpsDataOffset + 10);
    const satellites = buffer[gpsDataOffset + 12];
    const speed = buffer.readInt16BE(gpsDataOffset + 13);

    const ioStartOffset = gpsDataOffset + 15;
    const { ioMap } = parseCodec8IO(buffer, ioStartOffset);

    let card_id = null;
    if (ioMap[157] && !/^0+$/.test(ioMap[157].hex)) {
      card_id = ioMap[157].hex.toLowerCase();
    }

    const dataRecord = { timestamp: timestampDate, longitude, latitude, altitude, angle, satellites, speed, card_id };

    const query = { date, imei };
    const existing = await collection.findOne(query);

    if (existing) {
      await collection.updateOne(query, { $push: { data: dataRecord } });
    } else {
      await collection.insertOne({ date, imei, data: [dataRecord] });
    }

    logToFile(`✅ [${imei}] Inserted record. card_id=${card_id || 'none'}`);
  } catch (err) {
    logToFile(`❌ [${imei}] Error decoding AVL data: ${err.message}`);
  }
}

// === Старт TCP сервера ===
async function startServer() {
  await client.connect();
  logToFile('✅ Connected to MongoDB');

  const db = client.db(DATABASE_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const server = net.createServer(socket => {
    logToFile(`🔌 Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

    let imei = '';

    socket.once('data', data => {
      imei = cleanImei(data.toString().trim());
      logToFile(`📡 Received IMEI: ${imei}`);
      sendConfirmation(socket);

      socket.on('data', async packet => {
        const hexString = packet.toString('hex');

        if (!shouldStorePacket(imei, hexString)) {
          logToFile(`⚠️ Packet skipped (limit reached) for IMEI ${imei}`);
          sendConfirmation(socket);
          return;
        }

        logToFile(`📦 RAW HEX (${imei}): ${hexString}`);
        await decodeAvlData(packet, imei, collection);
        sendConfirmation(socket);
      });

      socket.on('close', () => logToFile(`❌ Client disconnected: ${imei}`));
      socket.on('error', err => logToFile(`⚠️ Socket error: ${err.message}`));
    });
  });

  server.listen(PORT, HOST, () => logToFile(`🚀 Server listening on ${HOST}:${PORT}`));
}

startServer().catch(err => logToFile(`💥 Server failed to start: ${err.message}`));
