document.addEventListener('DOMContentLoaded', function() {
    const burgerIcon = document.querySelector('.header-burger__icon');
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerBg = document.querySelector('.burger-menu__bg');
    const closeBtn = document.querySelector('.burger-menu__close');

    const animationDuration = 300;

    function showBurgerMenu() {
        burgerMenu.classList.remove('animate__fadeOutLeft');
        burgerBg.classList.remove('animate__fadeOut');
        
        burgerMenu.classList.add('animate__fadeInLeft');
        burgerMenu.classList.add('animate__animated');
        burgerMenu.style.display = 'block';

        burgerMenu.style.animationDuration = `${animationDuration}ms`;

        burgerBg.classList.add('animate__fadeIn');
        burgerBg.classList.add('animate__animated');
        burgerBg.style.display = 'block';
        burgerBg.style.animationDuration = `${animationDuration}ms`;
    }

    function hideBurgerMenu() {
        burgerMenu.classList.remove('animate__fadeInLeft');
        burgerBg.classList.remove('animate__fadeIn');
        
        burgerMenu.classList.add('animate__fadeOutLeft');
        burgerMenu.classList.add('animate__animated');
        burgerMenu.style.animationDuration = `${animationDuration}ms`;
        setTimeout(() => {
            burgerMenu.style.display = 'none';
        }, animationDuration);

        burgerBg.classList.add('animate__fadeOut');
        burgerBg.classList.add('animate__animated');
        burgerBg.style.animationDuration = `${animationDuration}ms`;
        setTimeout(() => {
            burgerBg.style.display = 'none';
        }, animationDuration);
    }

    if (burgerIcon) {
        burgerIcon.addEventListener('click', showBurgerMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hideBurgerMenu);
    }

    if (burgerBg) {
        burgerBg.addEventListener('click', hideBurgerMenu);
    }




    

    const notification = document.getElementById('access-notification');

    function showAccessNotification() {
        notification.classList.remove('notification-hidden');
        notification.classList.add('notification-visible');

        setTimeout(() => {
            notification.classList.remove('notification-visible');
            notification.classList.add('notification-hidden');
        }, 2000);
    }

    document.querySelectorAll('.header_inside-item-disabled').forEach(item => {
        item.addEventListener('click', showAccessNotification);
    });





});
