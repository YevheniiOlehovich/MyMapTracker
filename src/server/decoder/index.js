const net = require('net');
const { MongoClient } = require('mongodb');
const { Buffer } = require('buffer');

// Налаштування сервера
const HOST = '0.0.0.0';
const PORT = 20120;

// Підключення до MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://keildra258:aJuvQLKxaw5Lb5xf@cluster0.k4l1p.mongodb.net/';
const DATABASE_NAME = 'test';
const COLLECTION_NAME = 'avl_records';

const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function startServer() {
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db(DATABASE_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const server = net.createServer((socket) => {
    console.log('Client connected:', socket.remoteAddress, socket.remotePort);

    let imei = '';

    socket.once('data', (data) => {
      imei = cleanImei(data.toString().trim());
      console.log('Received IMEI:', imei);
      sendConfirmation(socket);

      socket.on('data', (packet) => {
        console.log('Received data (hex):', packet.toString('hex'));
        decodeAvlData(packet, imei, collection);
        sendConfirmation(socket);
      });

      socket.on('close', () => {
        console.log('Client disconnected.');
      });

      socket.on('error', (err) => {
        console.error('Socket error:', err.message);
      });
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
  });
}

// Очищення IMEI
function cleanImei(imei) {
  return imei.replace(/\D/g, '');
}

// Відправка підтвердження клієнту
function sendConfirmation(socket) {
  socket.write(Buffer.from([0x01]));
}

// Декодування AVL-даних
async function decodeAvlData(buffer, imei, collection) {
  try {
    const timestampMs = buffer.readBigUInt64BE(10);
    const timestamp = Number(timestampMs) / 1000;

    if (timestamp < 0 || timestamp > 2147483647) {
      console.error(`Invalid timestamp: ${timestamp} from IMEI ${imei}`);
      return;
    }

    const timestampDate = new Date(timestamp * 1000);
    const date = timestampDate.toISOString().split('T')[0];

    const gpsDataOffset = 10 + 8 + 1;

    const longitude = buffer.readInt32BE(gpsDataOffset) / 10000000;
    const latitude = buffer.readInt32BE(gpsDataOffset + 4) / 10000000;
    const altitude = buffer.readInt16BE(gpsDataOffset + 8);
    const angle = buffer.readInt16BE(gpsDataOffset + 10);
    const satellites = buffer[gpsDataOffset + 12];
    const speed = buffer.readInt16BE(gpsDataOffset + 13);

    const dataRecord = {
      timestamp: timestampDate,
      longitude,
      latitude,
      altitude,
      angle,
      satellites,
      speed
    };

    const query = { date, imei };
    const existingDocument = await collection.findOne(query);

    if (existingDocument) {
      await collection.updateOne(query, { $push: { data: dataRecord } });
    } else {
      const newDocument = {
        date,
        imei,
        data: [dataRecord]
      };
      await collection.insertOne(newDocument);
    }

    console.log('Data inserted into MongoDB');
  } catch (error) {
    console.error(`Error decoding AVL data from IMEI ${imei}:`, error.message);
  }
}

// Старт сервера
startServer().catch((err) => {
  console.error('Server failed to start:', err.message);
});
