import fs from 'fs';
import axios from 'axios';
import path from 'path';

// URL вашого сервера
const url = 'http://localhost:5000/geo_data/geozone';

// Читаємо дані з файлу geozone_data.json
const geozoneFilePath = path.resolve('./helpres/GeoZones.geojson');
const geozoneData = JSON.parse(fs.readFileSync(geozoneFilePath, 'utf8'));

// Функція для відправки даних частинами
const sendDataInChunks = async (data, chunkSize) => {
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        try {
            const response = await axios.post(url, chunk);
            console.log(`Chunk ${i / chunkSize + 1} sent successfully:`, response.data);
        } catch (error) {
            console.error(`Error sending chunk ${i / chunkSize + 1}:`, error.message);
        }
    }
};

// Відправляємо дані частинами по 10 елементів
sendDataInChunks(geozoneData, 10);