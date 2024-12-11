document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('background-video');
    const locationDisplay = document.createElement('div');

    Object.assign(locationDisplay.style, {
        position: 'absolute',
        top: '11px',
        left: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.164)',
        backdropFilter: 'blur(20px)',
        padding: '13px 17px',
        color: 'rgba(255, 255, 255, 0.692)',
        fontSize: '14px',
        cursor: 'pointer',
        fontFamily: 'Arial, sans-serif',
        zIndex: '1000'
    });

    locationDisplay.textContent = 'Konum alınıyor...';
    locationDisplay.className = 'konum';
    document.body.appendChild(locationDisplay);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => handleLocation(position),
            error => handleError(error),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        locationDisplay.textContent = 'Tarayıcınız konum izinlerini desteklemiyor.';
    }

    let currentWeather = null;

    async function handleLocation(position) {
        const { latitude, longitude } = position.coords;

        try {
            const [weatherData, locationData] = await Promise.all([
                fetchWeather(latitude, longitude),
                reverseGeocode(latitude, longitude)
            ]);

            if (locationData) {
                const { country, state, county, suburb } = locationData;
                locationDisplay.textContent = `${country}, ${state}, ${county}, ${suburb}`;
            } else {
                locationDisplay.textContent = 'Konum bilgisi bulunamadı.';
            }

            if (weatherData) {
                const weather = weatherData.weather[0].main.toLowerCase();
                if (currentWeather !== weather) {
                    currentWeather = weather;
                    playMusicAndChangeVideo(weather);
                }
            }
        } catch (error) {
            console.error('Bir hata oluştu:', error);
            locationDisplay.textContent = 'Veriler alınırken hata oluştu.';
        }
    }

    function handleError(error) {
        console.error('Konum hatası:', error);
        locationDisplay.textContent = 'Konum alınamadı.';
    }

    async function fetchWeather(lat, lon) {
        const apiKey = '3ad1e9bf897751b8f13b89dbe80aa503';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Hava durumu alınamadı.');
        return response.json();
    }

    async function reverseGeocode(lat, lon) {
        const apiKey = '661c803912974bedb7ba2a092ad90d22';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Ters geokodlama başarısız.');
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const locationInfo = data.results[0].components;
            return {
                country: locationInfo.country || 'Bilinmeyen ülke',
                state: locationInfo.state || 'Bilinmeyen şehir',
                county: locationInfo.county || locationInfo.city || locationInfo.village || 'Bilinmeyen ilçe',
                suburb: locationInfo.suburb || locationInfo.neighbourhood || locationInfo.locality || 'Bilinmeyen mahalle'
            };
        }
        return null;
    }

    function playMusicAndChangeVideo(weather) {
        const audioElement = new Audio();
        const mediaMap = {
            clear: { music: '/music/gunes.mp3', video: '/video/gunes.mp4' },
            rain: { music: '/music/yagmurlu.mp3', video: '/video/yagmurlu.mp4' },
            snow: { music: '/music/karli.mp3', video: '/video/karli.mp4' },
            clouds: { music: '/music/default.mp3', video: '/video/default.mp4' },
            default: { music: '/music/default.mp3', video: '/video/default.mp4' }
        };

        const media = mediaMap[weather] || mediaMap.default;
        
        document.body.style.opacity = '0';

        videoElement.addEventListener('loadeddata', () => {
            document.body.style.opacity = '1';
        }, { once: true });

        audioElement.src = media.music;
        videoElement.src = media.video;

        audioElement.loop = true;
        audioElement.play().catch(error => console.error('Müzik oynatılamadı:', error));
        videoElement.play().catch(error => console.error('Video oynatılamadı:', error));
    }
});