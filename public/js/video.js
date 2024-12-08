document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('background-video');
    const locationDisplay = document.createElement('div');

    // Konum bilgisini ekrana yazdıracak div
    locationDisplay.style.position = 'absolute';
    locationDisplay.style.top = '10px';
    locationDisplay.style.left = '10px';
    locationDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.164)';
    locationDisplay.style.backdropFilter = 'blur(20px)';
    locationDisplay.style.padding = '13px 17px';
    locationDisplay.style.color = 'rgba(255, 255, 255, 0.692)';
    locationDisplay.style.fontSize = '15px';
    locationDisplay.style.cursor = 'pointer';
    locationDisplay.style.fontFamily = 'Arial, sans-serif';
    locationDisplay.style.zIndex = '1000';
    locationDisplay.textContent = 'Konum alınıyor...';
    locationDisplay.className = 'konum'
    document.body.appendChild(locationDisplay);

    // Konum alma işlemi
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    } else {
        locationDisplay.textContent = 'Tarayıcınız konum izinlerini desteklemiyor.';
    }

    async function onSuccess(position) {
        const { latitude, longitude } = position.coords;
        await fetchWeather(latitude, longitude);
        await reverseGeocode(latitude, longitude);
    }

    function onError(error) {
        console.error('Konum hatası:', error);
        locationDisplay.textContent = 'Konum alınamadı.';
    }

    async function fetchWeather(lat, lon) {
        try {
            const apiKey = '3ad1e9bf897751b8f13b89dbe80aa503'; // OpenWeather API Key
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${apiKey}`
            );
            const data = await response.json();
            const weather = data.weather[0].main.toLowerCase();
            playMusicAndChangeVideo(weather);
        } catch (error) {
            console.error('Hava durumu hatası:', error);
            locationDisplay.textContent = 'Hava durumu alınamadı.';
        }
    }

    async function reverseGeocode(lat, lon) {
        try {
            const apiKey = '661c803912974bedb7ba2a092ad90d22'; // OpenCage API Key
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const locationInfo = data.results[0].components;
                const country = locationInfo.country || 'Bilinmeyen ülke';
                const state = locationInfo.state || 'Bilinmeyen şehir';
                const county = locationInfo.county || locationInfo.city || locationInfo.village || 'Bilinmeyen ilçe';
                let suburb = locationInfo.suburb || locationInfo.neighbourhood || locationInfo.locality || 'Bilinmeyen mahalle';

                // Çorum Merkez kontrolü
                if (state === 'Çorum' && suburb.toLowerCase().includes('merkez')) {
                    suburb = 'Merkez';
                }

                locationDisplay.textContent = `${country}, ${state}, ${county}, ${suburb}`;
            } else {
                locationDisplay.textContent = 'Konum bilgisi bulunamadı.';
            }
        } catch (error) {
            console.error('Ters geokodlama hatası:', error);
            locationDisplay.textContent = 'Konum bilgisi alınırken hata oluştu.';
        }
    }

    function playMusicAndChangeVideo(weather) {
        const audioElement = new Audio();
        switch (weather) {
            case 'clear':
                audioElement.src = '/music/gunes.mp3';
                videoElement.src = '/video/gunes.mp4';
                break;
            case 'rain':
                audioElement.src = '/music/yagmurlu.mp3';
                videoElement.src = '/video/yagmurlu.mp4';
                break;
            case 'snow':
                audioElement.src = '/music/karli.mp3';
                videoElement.src = '/video/karli.mp4';
                break;
            case 'clouds':
                audioElement.src = '/music/default.mp3';
                videoElement.src = '/video/default.mp4';
                break;
            default:
                audioElement.src = '/music/default.mp3';
                videoElement.src = '/video/default.mp4';
        }

        audioElement.loop = true;
        audioElement.play().catch(error => {
            console.error('Müzik oynatılamadı:', error);
        });

        videoElement.play().catch(error => {
            console.error('Video oynatılamadı:', error);
        });
    }
});
// Menü ikonunu ve bar'ı seç
const menuIcon = document.querySelector('.menu-icon');
const menuBar = document.querySelector('.bar');

// Menü ikonuna tıklama olayını ekle
menuIcon.addEventListener('click', () => {
    // Menü simgesine aktif sınıfını ekle/kaldır
    menuIcon.classList.toggle('active');
    menuBar.classList.toggle('active'); // Bar için aktif durumu

    // Menü ikonunun içeriğini değiştir
    if (menuIcon.classList.contains('active')) {
        menuIcon.innerHTML = '<i class="fa-regular fa-xmark"></i>'; // Kapatma simgesi
    } else {
        menuIcon.innerHTML = '<i class="fa-regular fa-bars-sort"></i>'; // Menü açma simgesi
    }
});
