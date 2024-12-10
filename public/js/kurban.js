document.addEventListener('DOMContentLoaded', () => {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    const circles = {
        days: document.getElementById('days-circle'),
        hours: document.getElementById('hours-circle'),
        minutes: document.getElementById('minutes-circle'),
        seconds: document.getElementById('seconds-circle'),
    };

    function updateCountdown() {
        const targetDate = new Date('June 6, 2025 12:15:00').getTime();
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            document.querySelector('.timer-wrapper').innerHTML = "<h2>Tatil Başladı!</h2>";
            return;
        }

        const totalDays = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const totalMinutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const totalSeconds = Math.floor((timeLeft / 1000) % 60);

        daysElement.textContent = totalDays;
        hoursElement.textContent = totalHours;
        minutesElement.textContent = totalMinutes;
        secondsElement.textContent = totalSeconds;

        updateProgress(totalDays, 365, 'days');
        updateProgress(totalHours, 24, 'hours');
        updateProgress(totalMinutes, 60, 'minutes');
        updateProgress(totalSeconds, 60, 'seconds');
    }

    function updateProgress(value, max, unit) {
        const percentage = (value / max) * 100;

        const colors = {
            days: '#ffb23e',
            hours: '#ECEFCB',
            minutes: '#ABC545',
            seconds: '#7995D5',
        };

        circles[unit].style.background = `conic-gradient(
            ${colors[unit]} ${percentage}%, 
            rgba(255, 255, 255, 0.1) ${percentage}%
        )`;
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
});
