const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// MongoDB Bağlantısı
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

const pageSchema = new mongoose.Schema({
    pageName: { type: String, required: true, unique: true },
    views: { type: Number, default: 0 },
});

const Page = mongoose.model('Page', pageSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Görüntülenme Oranını Güncelleyen Middleware
// Görüntülenme Oranını Güncelleyen Middleware
async function incrementPageView(req, res, next) {
    const pageName = 'home'; // Yalnızca 'home' sayfasının görüntülenme sayısı güncellenir
    try {
        const page = await Page.findOneAndUpdate(
            { pageName },
            { $inc: { views: 1 } },
            { upsert: true, new: true }
        );
        console.log(`Sayfa "${pageName}" görüntülenme sayısı güncellendi. Toplam: ${page.views}`);
    } catch (error) {
        console.error('Görüntülenme oranı güncellenirken hata oluştu:', error);
    }
    next();
}

// Ana Sayfada Verileri Göster
app.get('/', incrementPageView, async (req, res) => {
    try {
        const homePage = await Page.findOne({ pageName: 'home' });
        if (!homePage) {
            await Page.create({ pageName: 'home', views: 0 });
        }
        const totalViews = homePage ? homePage.views : 0;
        res.render('home', { totalViews });
    } catch (error) {
        console.error('Ana sayfa verileri alınırken hata oluştu:', error);
        res.status(500).send('Bir hata oluştu.');
    }
});

app.get('/onbes-tatil', incrementPageView, async (req, res) => {
    try {
        const homePage = await Page.findOne({ pageName: 'home' });
        const totalViews = homePage ? homePage.views : 0;
        res.render('onbes', { totalViews });
    } catch (error) {
        console.error('Onbeş tatil verileri alınırken hata oluştu:', error);
        res.status(500).send('Bir hata oluştu.');
    }
});

app.get('/kurban-tatil', incrementPageView, async (req, res) => {
    try {
        const homePage = await Page.findOne({ pageName: 'home' });
        const totalViews = homePage ? homePage.views : 0;
        res.render('kurban', { totalViews });
    } catch (error) {
        console.error('Kurban tatil verileri alınırken hata oluştu:', error);
        res.status(500).send('Bir hata oluştu.');
    }
});

app.get('/ara-tatil', incrementPageView, async (req, res) => {
    try {
        const homePage = await Page.findOne({ pageName: 'home' });
        const totalViews = homePage ? homePage.views : 0;
        res.render('ara', { totalViews });
    } catch (error) {
        console.error('Ara tatil verileri alınırken hata oluştu:', error);
        res.status(500).send('Bir hata oluştu.');
    }
});


// Hava Durumu API Rotası
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

// Sunucu Başlatma
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
