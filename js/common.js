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





    const form2 = document.querySelector('.subscribe');

    if (!form2) {
        console.error('Form with class "subscribe" not found.');
        return;
    }

    form2.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form2);
        const email = formData.get('email');
        const name = formData.get('name');

        if (!email || !name) {
            console.error('Email or Name is missing.');
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }


        const checkboxes = form2.querySelectorAll('input[type="checkbox"][required]');
        let allChecked = true;
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                allChecked = false;
            }
        });

        if (!allChecked) {
            alert('Пожалуйста, примите условия пользовательского соглашения и согласие на обработку персональных данных.');
            return;
        }

        // Подготовка данных для API Sendsay
        const requestData = {
            apikey: "19GX7ORKgYbHjCVsIdpgip6xdgO9S1kj8wE8Hx3PSacTpw9_MwLDcu92POg",
            action: "member.set",
            email: email,
            addr_type: "email",
            "newbie.confirm": "0",
            datakey: [
                ["-group.pl49303", "set", "1"],
                ["anketa.base.firstName", "set", name],
                ["custom.q123", "set", "Фандрайзинг"]
            ]
        };

        try {
            const response = await fetch("https://api.sendsay.ru/general/api/v100/json/mdoo", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                alert('Вы успешно подписались!');
                form2.reset(); 
            } else {
                console.error('API request failed:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                alert(`Произошла ошибка при подписке. Код ошибки: ${response.status}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Произошла сетевая ошибка. Пожалуйста, попробуйте позже.');
        }
    });






});
