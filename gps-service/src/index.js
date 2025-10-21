// const net = require('net');
// const { MongoClient } = require('mongodb');
// const { Buffer } = require('buffer');

// // Налаштування сервера
// const HOST = '0.0.0.0';
// const PORT = 20120;

// // Підключення до MongoDB Atlas
// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';
// const COLLECTION_NAME = 'avl_records';

// const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// async function startServer() {
//   await client.connect();
//   console.log('Connected to MongoDB');

//   const db = client.db(DATABASE_NAME);
//   const collection = db.collection(COLLECTION_NAME);

//   const server = net.createServer((socket) => {
//     console.log('Client connected:', socket.remoteAddress, socket.remotePort);

//     let imei = '';

//     socket.once('data', (data) => {
//       imei = cleanImei(data.toString().trim());
//       console.log('Received IMEI:', imei);
//       sendConfirmation(socket);

//       socket.on('data', (packet) => {
//         console.log('Received data (hex):', packet.toString('hex'));
//         decodeAvlData(packet, imei, collection);
//         sendConfirmation(socket);
//       });

//       socket.on('close', () => {
//         console.log('Client disconnected.');
//       });

//       socket.on('error', (err) => {
//         console.error('Socket error:', err.message);
//       });
//     });
//   });

//   server.listen(PORT, HOST, () => {
//     console.log(`Server listening on ${HOST}:${PORT}`);
//   });
// }

// // Очищення IMEI
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// // Відправка підтвердження клієнту
// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // Декодування AVL-даних
// async function decodeAvlData(buffer, imei, collection) {
//   try {
//     const timestampMs = buffer.readBigUInt64BE(10);
//     const timestamp = Number(timestampMs) / 1000;

//     if (timestamp < 0 || timestamp > 2147483647) {
//       console.error(`Invalid timestamp: ${timestamp} from IMEI ${imei}`);
//       return;
//     }

//     const timestampDate = new Date(timestamp * 1000);
//     const date = timestampDate.toISOString().split('T')[0];

//     const gpsDataOffset = 10 + 8 + 1;

//     const longitude = buffer.readInt32BE(gpsDataOffset) / 10000000;
//     const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 10000000;
//     const altitude = buffer.readInt16BE(gpsDataOffset + 8);
//     const angle = buffer.readInt16BE(gpsDataOffset + 10);
//     const satellites = buffer[gpsDataOffset + 12];
//     const speed = buffer.readInt16BE(gpsDataOffset + 13);

//     const dataRecord = {
//       timestamp: timestampDate,
//       longitude,
//       latitude,
//       altitude,
//       angle,
//       satellites,
//       speed
//     };

//     const query = { date, imei };
//     const existingDocument = await collection.findOne(query);

//     if (existingDocument) {
//       await collection.updateOne(query, { $push: { data: dataRecord } });
//     } else {
//       const newDocument = {
//         date,
//         imei,
//         data: [dataRecord]
//       };
//       await collection.insertOne(newDocument);
//     }

//     console.log('Data inserted into MongoDB');
//   } catch (error) {
//     console.error(`Error decoding AVL data from IMEI ${imei}:`, error.message);
//   }
// }

// // Старт сервера
// startServer().catch((err) => {
//   console.error('Server failed to start:', err.message);
// });









// const net = require('net');
// const { MongoClient } = require('mongodb');
// const { Buffer } = require('buffer');

// // Налаштування сервера
// const HOST = '0.0.0.0';
// const PORT = 20120;

// // MongoDB Atlas
// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';
// const COLLECTION_NAME = 'avl_records';

// const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// // === Основний запуск ===
// async function startServer() {
//   await client.connect();
//   console.log('✅ Connected to MongoDB');

//   const db = client.db(DATABASE_NAME);
//   const collection = db.collection(COLLECTION_NAME);

//   const server = net.createServer((socket) => {
//     console.log(`🚗 Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

//     let imei = '';

//     socket.once('data', (data) => {
//       imei = cleanImei(data.toString().trim());
//       console.log('📡 Received IMEI:', imei);
//       sendConfirmation(socket);

//       socket.on('data', async (packet) => {
//         console.log('📦 Received data (hex):', packet.toString('hex'));

//         // Перевіряємо, чи є текстовий EKEY у пакеті
//         const strData = packet.toString('utf8');
//         if (strData.includes('EKEY')) {
//           const ekey = parseEkey(strData);
//           if (ekey) {
//             console.log('💳 EKEY detected:', ekey);
//             await saveEkeyRecord(collection, imei, ekey);
//           }
//         } else {
//           await decodeAvlData(packet, imei, collection);
//         }

//         sendConfirmation(socket);
//       });

//       socket.on('close', () => console.log('❌ Client disconnected.'));
//       socket.on('error', (err) => console.error('⚠️ Socket error:', err.message));
//     });
//   });

//   server.listen(PORT, HOST, () => {
//     console.log(`🛰️ Server listening on ${HOST}:${PORT}`);
//   });
// }

// // === Допоміжні функції ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // === Парсинг EKEY ===
// function parseEkey(dataStr) {
//   const match = dataStr.match(/EKEY:\s*((?:0x[0-9A-Fa-f]{2}\s*)+)/);
//   if (!match) return null;

//   const bytes = match[1].trim().split(/\s+/);
//   return bytes.join(' ');
// }

// // === Збереження запису з RFID / карткою ===
// async function saveEkeyRecord(collection, imei, ekey) {
//   try {
//     const now = new Date();
//     const date = now.toISOString().split('T')[0];

//     const record = {
//       timestamp: now,
//       type: 'EKEY',
//       ekey,
//     };

//     const query = { date, imei };
//     const existingDocument = await collection.findOne(query);

//     if (existingDocument) {
//       await collection.updateOne(query, { $push: { data: record } });
//     } else {
//       await collection.insertOne({ date, imei, data: [record] });
//     }

//     console.log('💾 EKEY record saved to MongoDB');
//   } catch (err) {
//     console.error('Error saving EKEY record:', err.message);
//   }
// }

// // === Декодування AVL-даних ===
// async function decodeAvlData(buffer, imei, collection) {
//   try {
//     // TIMESTAMP
//     const timestampMs = buffer.readBigUInt64BE(10);
//     const timestamp = Number(timestampMs) / 1000;
//     if (timestamp < 0 || timestamp > 2147483647) {
//       console.error(`Invalid timestamp: ${timestamp} from IMEI ${imei}`);
//       return;
//     }

//     const timestampDate = new Date(timestamp * 1000);
//     const date = timestampDate.toISOString().split('T')[0];

//     const gpsDataOffset = 10 + 8 + 1;

//     const longitude = buffer.readInt32BE(gpsDataOffset) / 10000000;
//     const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 10000000;
//     const altitude = buffer.readInt16BE(gpsDataOffset + 8);
//     const angle = buffer.readInt16BE(gpsDataOffset + 10);
//     const satellites = buffer[gpsDataOffset + 12];
//     const speed = buffer.readInt16BE(gpsDataOffset + 13);

//     const dataRecord = {
//       timestamp: timestampDate,
//       longitude,
//       latitude,
//       altitude,
//       angle,
//       satellites,
//       speed,
//       type: 'GPS'
//     };

//     const query = { date, imei };
//     const existingDocument = await collection.findOne(query);

//     if (existingDocument) {
//       await collection.updateOne(query, { $push: { data: dataRecord } });
//     } else {
//       await collection.insertOne({ date, imei, data: [dataRecord] });
//     }

//     console.log('💾 GPS data saved to MongoDB');
//   } catch (error) {
//     console.error(`Error decoding AVL data from IMEI ${imei}:`, error.message);
//   }
// }

// // === Старт ===
// startServer().catch((err) => {
//   console.error('Server failed to start:', err.message);
// });











// const net = require('net');
// const { MongoClient } = require('mongodb');
// const { Buffer } = require('buffer');

// // === Налаштування ===
// const HOST = '0.0.0.0';
// const PORT = 20120;

// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';
// const COLLECTION_NAME = 'avl_records';
// const RAW_COLLECTION_NAME = 'raw_packets';

// const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// // === Запуск сервера ===
// async function startServer() {
//   await client.connect();
//   console.log('✅ Connected to MongoDB');

//   const db = client.db(DATABASE_NAME);
//   const collection = db.collection(COLLECTION_NAME);
//   const rawCollection = db.collection(RAW_COLLECTION_NAME);

//   const server = net.createServer((socket) => {
//     console.log(`🚗 Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

//     let imei = '';

//     socket.once('data', (data) => {
//       imei = cleanImei(data.toString().trim());
//       console.log('📡 Received IMEI:', imei);
//       sendConfirmation(socket);

//       socket.on('data', async (packet) => {
//         const rawHex = packet.toString('hex');
//         console.log('📦 Received data (hex):', rawHex);

//         // Зберігаємо сирий пакет у колекцію raw_packets
//         await logRawPacket(rawCollection, imei, rawHex);

//         // Перевіряємо, чи містить пакет EKEY
//         const strData = packet.toString('utf8');
//         if (strData.includes('EKEY')) {
//           const ekey = parseEkey(strData);
//           if (ekey) {
//             console.log('💳 EKEY detected:', ekey);
//             await saveEkeyRecord(collection, imei, ekey, rawHex);
//           }
//         } else {
//           await decodeAvlData(packet, imei, collection, rawHex);
//         }

//         sendConfirmation(socket);
//       });

//       socket.on('close', () => console.log('❌ Client disconnected.'));
//       socket.on('error', (err) => console.error('⚠️ Socket error:', err.message));
//     });
//   });

//   server.listen(PORT, HOST, () => {
//     console.log(`🛰️ Server listening on ${HOST}:${PORT}`);
//   });
// }

// // === Допоміжні функції ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // === Логування сирих пакетів ===
// async function logRawPacket(rawCollection, imei, rawHex) {
//   try {
//     await rawCollection.insertOne({
//       imei,
//       rawHex,
//       receivedAt: new Date(),
//     });
//     console.log('🗃️ Raw packet logged');
//   } catch (err) {
//     console.error('Error logging raw packet:', err.message);
//   }
// }

// // === Парсинг EKEY ===
// function parseEkey(dataStr) {
//   const match = dataStr.match(/EKEY:\s*((?:0x[0-9A-Fa-f]{2}\s*)+)/);
//   if (!match) return null;
//   const bytes = match[1].trim().split(/\s+/);
//   return bytes.join(' ');
// }

// // === Збереження запису EKEY ===
// async function saveEkeyRecord(collection, imei, ekey, rawHex) {
//   try {
//     const now = new Date();
//     const date = now.toISOString().split('T')[0];

//     const record = {
//       timestamp: now,
//       type: 'EKEY',
//       ekey,
//       rawHex,
//     };

//     const query = { date, imei };
//     const existingDocument = await collection.findOne(query);

//     if (existingDocument) {
//       await collection.updateOne(query, { $push: { data: record } });
//     } else {
//       await collection.insertOne({ date, imei, data: [record] });
//     }

//     console.log('💾 EKEY record saved to MongoDB');
//   } catch (err) {
//     console.error('Error saving EKEY record:', err.message);
//   }
// }

// // === Декодування AVL-даних ===
// async function decodeAvlData(buffer, imei, collection, rawHex) {
//   try {
//     const timestampMs = buffer.readBigUInt64BE(10);
//     const timestamp = Number(timestampMs) / 1000;
//     if (timestamp < 0 || timestamp > 2147483647) {
//       console.error(`Invalid timestamp: ${timestamp} from IMEI ${imei}`);
//       return;
//     }

//     const timestampDate = new Date(timestamp * 1000);
//     const date = timestampDate.toISOString().split('T')[0];

//     const gpsDataOffset = 10 + 8 + 1;

//     const longitude = buffer.readInt32BE(gpsDataOffset) / 10000000;
//     const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 10000000;
//     const altitude = buffer.readInt16BE(gpsDataOffset + 8);
//     const angle = buffer.readInt16BE(gpsDataOffset + 10);
//     const satellites = buffer[gpsDataOffset + 12];
//     const speed = buffer.readInt16BE(gpsDataOffset + 13);

//     const dataRecord = {
//       timestamp: timestampDate,
//       longitude,
//       latitude,
//       altitude,
//       angle,
//       satellites,
//       speed,
//       type: 'GPS',
//       rawHex,
//     };

//     const query = { date, imei };
//     const existingDocument = await collection.findOne(query);

//     if (existingDocument) {
//       await collection.updateOne(query, { $push: { data: dataRecord } });
//     } else {
//       await collection.insertOne({ date, imei, data: [dataRecord] });
//     }

//     console.log('💾 GPS data saved to MongoDB');
//   } catch (error) {
//     console.error(`Error decoding AVL data from IMEI ${imei}:`, error.message);
//   }
// }

// // === Старт сервера ===
// startServer().catch((err) => {
//   console.error('Server failed to start:', err.message);
// });



// const net = require('net');
// const { MongoClient } = require('mongodb');
// const { Buffer } = require('buffer');

// // Налаштування сервера
// const HOST = '0.0.0.0';
// const PORT = 20120;

// // Підключення до MongoDB Atlas
// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';
// const COLLECTION_NAME = 'avl_records';

// const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// async function startServer() {
//   await client.connect();
//   console.log('Connected to MongoDB');

//   const db = client.db(DATABASE_NAME);
//   const collection = db.collection(COLLECTION_NAME);

//   const server = net.createServer((socket) => {
//     console.log('Client connected:', socket.remoteAddress, socket.remotePort);

//     let imei = '';

//     socket.once('data', (data) => {
//       imei = cleanImei(data.toString().trim());
//       console.log('Received IMEI:', imei);
//       sendConfirmation(socket);

//       socket.on('data', (packet) => {
//         console.log('Received data (hex):', packet.toString('hex'));
//         decodeAvlData(packet, imei, collection);
//         sendConfirmation(socket);
//       });

//       socket.on('close', () => {
//         console.log('Client disconnected.');
//       });

//       socket.on('error', (err) => {
//         console.error('Socket error:', err.message);
//       });
//     });
//   });

//   server.listen(PORT, HOST, () => {
//     console.log(`Server listening on ${HOST}:${PORT}`);
//   });
// }

// // Очищення IMEI
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// // Відправка підтвердження клієнту
// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // --- Новий парсер IO (Codec8) ---
// function parseCodec8IO(buf, ioOffset) {
//   // Повертає { ioMap: { id: { size, hex, value } }, nextOffset }
//   let offset = ioOffset;
//   const ioMap = {};

//   if (offset >= buf.length) return { ioMap, nextOffset: offset };

//   try {
//     const eventId = buf.readUInt8(offset); offset += 1;
//     const totalIO = buf.readUInt8(offset); offset += 1;

//     // 1-byte IO
//     const oneCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < oneCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const val = buf.readUInt8(offset); offset += 1;
//       ioMap[id] = { size: 1, value: val, hex: val.toString(16).padStart(2, '0') };
//     }

//     // 2-byte IO
//     const twoCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < twoCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const val = buf.readUInt16BE(offset); offset += 2;
//       ioMap[id] = { size: 2, value: val, hex: val.toString(16).padStart(4, '0') };
//     }

//     // 4-byte IO
//     const fourCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < fourCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const val = buf.readUInt32BE(offset); offset += 4;
//       ioMap[id] = { size: 4, value: val, hex: val.toString(16).padStart(8, '0') };
//     }

//     // 8-byte IO
//     const eightCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < eightCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const valBuf = buf.slice(offset, offset + 8); offset += 8;
//       // hex as lower-case, zero-padded 16 chars
//       const hex = valBuf.toString('hex').padStart(16, '0');
//       const value = Number(valBuf.readBigUInt64BE(0));
//       ioMap[id] = { size: 8, value, hex };
//     }

//     return { ioMap, nextOffset: offset };
//   } catch (e) {
//     // у випадку помилки — повертаємо те, що встигли
//     return { ioMap, nextOffset: offset };
//   }
// }

// // Декодування AVL-даних (оновлено, додаємо rfid поле)
// async function decodeAvlData(buffer, imei, collection) {
//   try {
//     // Якщо пакет має 4 байти preamble + 4 байти length, codec починається на 8
//     // наші приклади мають codec на offset 8 -> timestamp на 10..17
//     if (buffer.length < 34) {
//       console.error('Packet too short');
//       return;
//     }

//     // перевірка: очікуємо codec (0x08) на 8 байті
//     const codecPos = 8;
//     if (buffer.length <= codecPos || buffer[codecPos] !== 0x08) {
//       // намагаємось знайти 0x08 десь в пакеті (fallback)
//       const found = buffer.indexOf(Buffer.from([0x08]));
//       if (found === -1) {
//         console.error('Codec8 not found in packet');
//         return;
//       }
//       // якщо знайшли, змістимо базові офсети
//       // зробимо просте припущення, що timestamp починається через 2 байти після 0x08
//       // (але в наших пакутах зазвичай codecPos=8)
//       console.warn(`Codec8 at nonstandard offset ${found}, attempting parse`);
//     }

//     // timestamp (big-endian) починається на 10-му байті у стандартному пакеті
//     const timestampMs = buffer.readBigUInt64BE(10);
//     const timestamp = Number(timestampMs) / 1000; // seconds
//     // перевірка валідності timestamp (діапазон Unix time)
//     if (timestamp < 0 || timestamp > 4102444800) { // до 2100-01-01
//       console.error(`Invalid timestamp: ${timestamp} from IMEI ${imei}`);
//       return;
//     }
//     const timestampDate = new Date(timestamp * 1000);
//     const date = timestampDate.toISOString().split('T')[0];

//     // GPS поля — офсети відповідно до Codec8:
//     // longitude @ offset 19..22, latitude @ 23..26 в оригінальному скрипті було трохи по-іншому,
//     // але у твоєму варіанті (як у розборі вище) ми використовували gpsDataOffset = 10 + 8 + 1 = 19
//     const gpsDataOffset = 10 + 8 + 1; // 19
//     if (buffer.length < gpsDataOffset + 15) {
//       console.error('Packet too short for GPS + IO start');
//       return;
//     }

//     const longitude = buffer.readInt32BE(gpsDataOffset) / 10000000;
//     const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 10000000;
//     const altitude = buffer.readInt16BE(gpsDataOffset + 8);
//     const angle = buffer.readInt16BE(gpsDataOffset + 10);
//     const satellites = buffer[gpsDataOffset + 12];
//     const speed = buffer.readInt16BE(gpsDataOffset + 13);

//     // IO починається після speed: gpsDataOffset + 15
//     const ioStartOffset = gpsDataOffset + 15;
//     const { ioMap } = parseCodec8IO(buffer, ioStartOffset);

//     // шукаємо RFID у IO: у твоїх прикладах це io_id = 157 (0x9D), size=8
//     let rfid = null;
//     const targetId = 157; // decimal
//     if (ioMap && ioMap[targetId] && ioMap[targetId].size === 8) {
//       const hex = ioMap[targetId].hex.toLowerCase();
//       // якщо не всі байти нулі — вважаємо валідним
//       if (!/^0+$/.test(hex)) {
//         rfid = hex; // "0000002900128fc3"
//       }
//     }

//     const dataRecord = {
//       timestamp: timestampDate,
//       longitude,
//       latitude,
//       altitude,
//       angle,
//       satellites,
//       speed,
//       rfid // або null
//     };

//     const query = { date, imei };
//     const existingDocument = await collection.findOne(query);

//     if (existingDocument) {
//       await collection.updateOne(query, { $push: { data: dataRecord } });
//     } else {
//       const newDocument = {
//         date,
//         imei,
//         data: [dataRecord]
//       };
//       await collection.insertOne(newDocument);
//     }

//     console.log(`Data inserted into MongoDB (imei=${imei}) rfid=${rfid}`);
//   } catch (error) {
//     console.error(`Error decoding AVL data from IMEI ${imei}:`, error.stack || error.message);
//   }
// }

// // Старт сервера
// startServer().catch((err) => {
//   console.error('Server failed to start:', err.message);
// });



// const net = require('net');
// const { MongoClient } = require('mongodb');

// // === Налаштування сервера ===
// const HOST = '0.0.0.0';
// const PORT = 20120;

// // === MongoDB ===
// const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
// const DATABASE_NAME = 'test';
// const COLLECTION_NAME = 'avl_records';

// const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// // === Старт сервера ===
// async function startServer() {
//   await client.connect();
//   console.log('Connected to MongoDB');

//   const db = client.db(DATABASE_NAME);
//   const collection = db.collection(COLLECTION_NAME);

//   const server = net.createServer(socket => {
//     console.log('Client connected:', socket.remoteAddress, socket.remotePort);

//     let imei = '';

//     socket.once('data', data => {
//       imei = cleanImei(data.toString().trim());
//       console.log('Received IMEI:', imei);
//       sendConfirmation(socket);

//       socket.on('data', packet => {
//         console.log('Received data (hex):', packet.toString('hex'));
//         decodeAvlData(packet, imei, collection);
//         sendConfirmation(socket);
//       });

//       socket.on('close', () => console.log('Client disconnected.'));
//       socket.on('error', err => console.error('Socket error:', err.message));
//     });
//   });

//   server.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}`));
// }

// // === Очищення IMEI ===
// function cleanImei(imei) {
//   return imei.replace(/\D/g, '');
// }

// // === Підтвердження клієнту ===
// function sendConfirmation(socket) {
//   socket.write(Buffer.from([0x01]));
// }

// // === Парсер IO (Codec8) ===
// function parseCodec8IO(buf, ioOffset) {
//   let offset = ioOffset;
//   const ioMap = {};

//   if (offset >= buf.length) return { ioMap, nextOffset: offset };

//   try {
//     offset += 1; // eventId
//     const totalIO = buf.readUInt8(offset); offset += 1;

//     // 1-byte IO
//     const oneCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < oneCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const val = buf.readUInt8(offset); offset += 1;
//       ioMap[id] = { size: 1, value: val, hex: val.toString(16).padStart(2, '0') };
//     }

//     // 2-byte IO
//     const twoCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < twoCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const val = buf.readUInt16BE(offset); offset += 2;
//       ioMap[id] = { size: 2, value: val, hex: val.toString(16).padStart(4, '0') };
//     }

//     // 4-byte IO
//     const fourCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < fourCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const val = buf.readUInt32BE(offset); offset += 4;
//       ioMap[id] = { size: 4, value: val, hex: val.toString(16).padStart(8, '0') };
//     }

//     // 8-byte IO
//     const eightCount = buf.readUInt8(offset); offset += 1;
//     for (let i = 0; i < eightCount; i++) {
//       const id = buf.readUInt8(offset); offset += 1;
//       const valBuf = buf.slice(offset, offset + 8); offset += 8;
//       const hex = valBuf.toString('hex').padStart(16, '0');
//       const value = Number(valBuf.readBigUInt64BE(0));
//       ioMap[id] = { size: 8, value, hex };
//     }

//     return { ioMap, nextOffset: offset };
//   } catch {
//     return { ioMap, nextOffset: offset };
//   }
// }

// // === Декодування AVL-даних ===
// async function decodeAvlData(buffer, imei, collection) {
//   try {
//     if (buffer.length < 34) return console.error('Packet too short');

//     const codecPos = 8;
//     if (buffer[codecPos] !== 0x08) console.warn('Codec8 not found at standard offset');

//     const timestampMs = buffer.readBigUInt64BE(10);
//     const timestamp = Number(timestampMs) / 1000;
//     if (timestamp < 0 || timestamp > 4102444800) return console.error('Invalid timestamp');

//     const timestampDate = new Date(timestamp * 1000);
//     const date = timestampDate.toISOString().split('T')[0];

//     const gpsDataOffset = 19;
//     if (buffer.length < gpsDataOffset + 15) return console.error('Packet too short for GPS');

//     const longitude = buffer.readInt32BE(gpsDataOffset) / 1e7;
//     const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 1e7;
//     const altitude = buffer.readInt16BE(gpsDataOffset + 8);
//     const angle = buffer.readInt16BE(gpsDataOffset + 10);
//     const satellites = buffer[gpsDataOffset + 12];
//     const speed = buffer.readInt16BE(gpsDataOffset + 13);

//     const ioStartOffset = gpsDataOffset + 15;
//     const { ioMap } = parseCodec8IO(buffer, ioStartOffset);

//     let card_id = null;
//     if (ioMap[157] && ioMap[157].size === 8 && !/^0+$/.test(ioMap[157].hex)) {
//       card_id = ioMap[157].hex.toLowerCase();
//     }

//     const dataRecord = { timestamp: timestampDate, longitude, latitude, altitude, angle, satellites, speed, card_id };

//     const query = { date, imei };
//     const existing = await collection.findOne(query);

//     if (existing) {
//       await collection.updateOne(query, { $push: { data: dataRecord } });
//     } else {
//       await collection.insertOne({ date, imei, data: [dataRecord] });
//     }

//     console.log(`Inserted: IMEI=${imei}, card_id=${card_id}`);
//   } catch (err) {
//     console.error('Error decoding AVL data:', err.stack || err.message);
//   }
// }

// startServer().catch(err => console.error('Server failed to start:', err.message));









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

// === Допоміжна функція для запису в лог ===
function logToFile(message) {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const logFile = path.join(LOG_DIR, `${date}.log`);
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  console.log(message);
}

// === MongoDB клієнт ===
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// === Старт сервера ===
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

      socket.on('data', packet => {
        const hexString = packet.toString('hex');
        logToFile(`📦 RAW HEX (${imei}): ${hexString}`); // ✅ повний сирий пакет

        decodeAvlData(packet, imei, collection);
        sendConfirmation(socket);
      });

      socket.on('close', () => logToFile(`❌ Client disconnected: ${imei}`));
      socket.on('error', err => logToFile(`⚠️ Socket error: ${err.message}`));
    });
  });

  server.listen(PORT, HOST, () => logToFile(`🚀 Server listening on ${HOST}:${PORT}`));
}

// === Допоміжні функції ===
function cleanImei(imei) {
  return imei.replace(/\D/g, '');
}

function sendConfirmation(socket) {
  socket.write(Buffer.from([0x01]));
}

// === IO Парсер ===
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

// === Основна функція розбору AVL ===
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

startServer().catch(err => logToFile(`💥 Server failed to start: ${err.message}`));
