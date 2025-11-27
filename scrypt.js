const net = require('net');

const HOST = '54.165.56.1';
const PORT = 20120;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log(`✅ Connected to ${HOST}:${PORT}`);
});

client.on('data', (data) => {
  console.log('📥 Received:', data.toString('hex'));
});

client.on('close', () => {
  console.log('🔴 Connection closed');
});

client.on('error', (err) => {
  console.error('⚠️ Error:', err.message);
});


// const https = require('https');

// https.get('https://api.ipify.org?format=json', (res) => {
//   let data = '';
//   res.on('data', chunk => data += chunk);
//   res.on('end', () => {
//     const ip = JSON.parse(data).ip;
//     console.log('🌐 My public IP is:', ip);
//   });
// });
