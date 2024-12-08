const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios'); // Axios modülü

// OpenWeatherMap API bilgileri
const API_KEY = '3ad1e9bf897751b8f13b89dbe80aa503'; // Kendi API anahtarınızı buraya ekleyin

// EJS ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statik dosyaları ayarla
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/onbes-tatil', (req, res) => {
    res.render('onbes');
});
app.get('/kurban-tatil', (req, res) => {
    res.render('kurban');
});
app.get('/ara-tatil', (req, res) => {
    res.render('ara');
});
// Hava durumu verilerini dönen API endpoint'i
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Lütfen enlem ve boylam gönderin.' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url); // Axios kullanarak API çağrısı
        res.json(response.data); // Hava durumu verilerini istemciye gönder
    } catch (error) {
        console.error('Hava durumu verisi alınırken hata:', error.message);
        res.status(500).json({ error: 'Hava durumu verisi alınamadı.' });
    }
});

// Sunucuyu başlat
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
