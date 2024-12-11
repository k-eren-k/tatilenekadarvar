const menuIcon = document.querySelector('.menu-icon');
const barMenu = document.querySelector('.bar');
const menuIconIcon = menuIcon.querySelector('i');

menuIcon.addEventListener('click', () => {
    barMenu.classList.toggle('active');
    if (barMenu.classList.contains('active')) {
        menuIconIcon.className = 'fa-regular fa-bars-sort';
    } else {
        menuIconIcon.className = 'fa-regular fa-bars';
    }
});
