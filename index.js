const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

const API_KEY = '3ad1e9bf897751b8f13b89dbe80aa503';
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Lütfen enlem ve boylam gönderin.' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Hava durumu verisi alınırken hata:', error.message);
        res.status(500).json({ error: 'Hava durumu verisi alınamadı.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});