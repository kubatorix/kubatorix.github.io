document.addEventListener("DOMContentLoaded", function() {


    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('slider');

    const texts = [
        {
            content: "Портрет современного фандрайзера: над чем он работает и о чём переживает, в каких условиях находится и что его мотивирует, чего ищет и что хочет изменить.",
            color: "#AA6EFF",
            x: 50, y: 100, width: 400
        },
        {
            content: "Портрет руководителя НКО или руководителя департамента, который фандрайзеров нанимает и фандрайзерами управляет: каков опыт работы с ними, насколько успешен поиск, каковы результаты и какие вызовы стоят.",
            color: "#FF6E32",
            x: 500, y: 200, width: 450
        }
    ];

    const originalTexts = JSON.parse(JSON.stringify(texts));

    let particles = [];

    function init() {
        const isMobile = window.innerWidth < 770;

        if (isMobile) {
            canvas.width = window.innerWidth - 20; 
            canvas.height = 470; 
            ctx.font = "22px sans-serif"; 
        } else {
            canvas.width = 1100;
            canvas.height = 400;
            ctx.font = "24px sans-serif";
        }

        particles = [];

        texts.forEach((t, index) => {
            let textX, textY, textWidth;

            if (isMobile) {
                textX = 10;
                textY = 80 + (index * 180); 
                textWidth = canvas.width - 40; 
            } else {
                textX = originalTexts[index].x;
                textY = originalTexts[index].y;
                textWidth = originalTexts[index].width;
            }

            const words = t.content.split(' ');
            let currentX = textX;
            let currentY = textY;
            const lineHeight = 25;

            words.forEach(word => {
                const wordWidth = ctx.measureText(word + ' ').width;
                if (currentX + wordWidth > textX + textWidth) {
                    currentX = textX;
                    currentY += lineHeight;
                }

                for (let char of (word + ' ')) {
                    const charWidth = ctx.measureText(char).width;
                    particles.push({
                        char: char,
                        color: t.color,

                        targetX: currentX,
                        targetY: currentY,

                        startX: Math.random() * canvas.width,
                        startY: Math.random() * canvas.height,

                        startAngle: (Math.random() - 0.5) * Math.PI
                    });
                    currentX += charWidth;
                }
            });
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const progress = parseFloat(slider.value);

        particles.forEach(p => {
            const x = p.startX + (p.targetX - p.startX) * progress;
            const y = p.startY + (p.targetY - p.startY) * progress;

            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.3 + (progress * 0.7);
            ctx.fillText(p.char, 0, 0);
            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    slider.addEventListener('input', () => {});

    init();
    draw();











    const checkboxes = document.querySelectorAll('.checkbox_default');
    checkboxes.forEach(cb => {
        cb.addEventListener('click', function(event) {
            const parent = this.closest('.checkbox-group');
            const checkedCount = parent.querySelectorAll('.checkbox_default:checked').length;
            if (checkedCount === 0) {
                this.checked = true; 
                return; 
            }
            handleCheckboxChange(this.id, this.checked);
        });
    });

    function handleCheckboxChange(id, isChecked) {
        if (id === 'opt-1') {
            if (isChecked) {
                document.querySelector('.checkbox_custom__text1').style.opacity = '100%';
                document.querySelector('.welcome-caption__2').textContent = 'фандрайзеров';
                document.querySelector('.welcome-caption__3').innerHTML = 'и&nbsp;их&nbsp;нанимателей';
            }
            else {
                document.querySelector('.checkbox_custom__text1').style.opacity = '10%';
                document.querySelector('.welcome-caption__2').textContent = 'нанимателей';
                document.querySelector('.welcome-caption__3').textContent = 'фандрайзеров';
            }
        }
        else if (id === 'opt-2') {
            if (isChecked) {
                document.querySelector('.checkbox_custom__text2').style.opacity = '100%';
                document.querySelector('.welcome-caption__3').style.color = 'rgba(255, 255, 255, 1)';
            }
            else {
                document.querySelector('.checkbox_custom__text2').style.opacity = '10%';
                document.querySelector('.welcome-caption__3').style.color = 'rgba(255, 255, 255, 0.1)';
            }
        }
        else if (id === 'opt-3') {
            if (isChecked) {
                document.querySelector('.num-6').style.opacity = '100%';
                document.querySelector('.static-part').style.webkitTextStroke = '2px #FFFFFF';
                document.querySelector('.section3_text2').style.opacity = '100%';
                
            }
            else {
               document.querySelector('.num-6').style.opacity = '10%';
               document.querySelector('.static-part').style.webkitTextStroke = '2px #FF6E32';
               document.querySelector('.section3_text2').style.opacity = '10%';
            }
        }
        else if (id === 'opt-4') {
            if (isChecked) {
                document.querySelector('.num-4').style.opacity = '100%';
                document.querySelector('.static-part').style.webkitTextStroke = '2px #FFFFFF';
                document.querySelector('.section3_text3').style.opacity = '100%';
            }
            else {
               document.querySelector('.num-4').style.opacity = '10%';
               document.querySelector('.static-part').style.webkitTextStroke = '2px #AA6EFF';
               document.querySelector('.section3_text3').style.opacity = '10%';
            }
        }
        else if (id === 'opt-5') {
            if (isChecked) {
                document.querySelector('.word-purple').style.opacity = '100%';
                document.querySelector('.bottom-row').style.webkitTextStroke = '1px #FFFFFF';
                document.querySelector('.section4_text1').style.opacity = '100%';
            }
            else {
               document.querySelector('.word-purple').style.opacity = '10%';
               document.querySelector('.bottom-row').style.webkitTextStroke = '1px #FF6E32';
               document.querySelector('.section4_text1').style.opacity = '10%';
            }
        }
        else if (id === 'opt-6') {
            if (isChecked) {
                document.querySelector('.word-orange').style.opacity = '100%';
                document.querySelector('.bottom-row').style.webkitTextStroke = '1px #FFFFFF';
                document.querySelector('.section4_text2').style.opacity = '100%';
            }
            else {
               document.querySelector('.word-orange').style.opacity = '10%';
               document.querySelector('.bottom-row').style.webkitTextStroke = '1px #AA6EFF';
               document.querySelector('.section4_text2').style.opacity = '10%';
            }
        }
    }




    const popup = document.querySelector('.popup-research');
    const popupBg = document.querySelector('.popup-bg');
    const closeButton = document.querySelector('.popup-research__close');

    const closePopup = () => {
        popup.style.display = 'none';
        popupBg.style.display = 'none';
    };

    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }

    if (popupBg) {
        popupBg.addEventListener('click', (e) => {

        if (e.target === popupBg) {
            closePopup();
        }
        });
    }


    const openButtons = document.querySelectorAll('.section7-btn, .welcome-btn');
    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            popupBg.style.display = 'block';
            popup.style.display = 'block';
        });
    });
    popupBg.addEventListener('click', () => {
        popupBg.style.display = 'none';
        popup.style.display = 'none';
    });





    const popupResearchForm = document.querySelector('.popup-research--form');

    if (!popupResearchForm) {
        console.error('Form with class "popup-research--form" not found.');
        return;
    }

    const successElement = document.querySelector('.popup-research__success');
    if (!successElement) {
        console.error('Success element ".popup-research__success" not found.');
        return;
    }

    popupResearchForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(popupResearchForm);
        const email = formData.get('email');
        const name = formData.get('name');

        if (!email || !name) {
            console.error('Email or Name is missing in popup form.');
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        const checkboxAgreement = popupResearchForm.querySelector('input[name="footer-checkbox__agreement"]');
        const checkboxPersonal = popupResearchForm.querySelector('input[name="footer-checkbox__personal"]');

        if (!checkboxAgreement || !checkboxAgreement.checked) {
            alert('Пожалуйста, примите условия пользовательского соглашения.');
            return;
        }
        if (!checkboxPersonal || !checkboxPersonal.checked) {
            alert('Пожалуйста, дайте согласие на обработку персональных данных.');
            return;
        }

        const requestData = {
            apikey: "19GX7ORKgYbHjCVsIdpgip6xdgO9S1kj8wE8Hx3PSacTpw9_MwLDcu92POg",
            action: "member.set",
            email: email,
            addr_type: email,
            "newbie.confirm": "0",
            datakey: [
                ["-group.pl99047", "set", "1"],
                ["base.firstName", "set", name], 
                ["custom.q123", "set", "Получить исследование"]
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
                console.log('Popup form Success:', result);

                popupResearchForm.style.display = 'none';
                successElement.style.display = 'block';

            } else {
                console.error('Popup form API request failed:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Popup form Error details:', errorText);
                alert(`Произошла ошибка при отправке запроса. Код ошибки: ${response.status}`);
            }
        } catch (error) {
            console.error('Popup form Network error:', error);
            alert('Произошла сетевая ошибка. Пожалуйста, попробуйте позже.');
        }
    });

    
    // const form = document.querySelector('.popup-research--form');
    // if (form) {
    //     form.addEventListener('submit', function(event) {
    //         event.preventDefault();

    //         const defaultText = document.querySelector('.popup-research__text__default');
    //         const successMessage = document.querySelector('.popup-research__success');
    //         var popup_button = document.getElementById("popup-research-btn");

    //         function success() {
    //             form.reset();
    //             if (defaultText) defaultText.style.display = 'none';
    //             if (form) form.style.display = 'none';
    //             if (successMessage) successMessage.style.display = 'block';
    //         }

    //         function error() {
    //             alert("Ошибка отправки данных");
    //         }

    //         popup_button.disabled = true;
    //         var popup_data = new FormData(form);
    //         ajax(form.method, form.action, popup_data, success, error);

    //     });
    // }


});


// function ajax(method, url, data, success, error) {
//     var xhr = new XMLHttpRequest();
//     xhr.open(method, url);
//     xhr.setRequestHeader("Accept", "application/json");
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState !== XMLHttpRequest.DONE) return;
//         if (xhr.status === 200) {
//             success(xhr.response, xhr.responseType);
//         } else {
//             error(xhr.status, xhr.response, xhr.responseType);
//         }
//     };
//     xhr.send(data);
// }



function updateTimer() {
    const now = new Date();
    // Целевая дата — 19 мая
    const targetDate = new Date(2026, 4, 19);

    let diff = targetDate - now;

    if (diff <= 0) {
        diff = 0;
    }

    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    const days = Math.floor(diff / DAY);
    const hours = Math.floor((diff % DAY) / HOUR);
    const minutes = Math.floor((diff % HOUR) / MINUTE);
    const seconds = Math.floor((diff % MINUTE) / SECOND);

    function getDayWord(dayCount) {
        if (dayCount === 0) return 'дней';
        const lastDigit = dayCount % 10;
        const lastTwoDigits = dayCount % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'дней';
        }
        switch (lastDigit) {
            case 1:
                return 'день';
            case 2:
            case 3:
            case 4:
                return 'дня';
            default:
                return 'дней';
        }
    }
    
    document.querySelector('.popup-research__success-days').textContent = `${days} ${getDayWord(days)}`;
    document.querySelector('.welcome-timer__days').textContent = `${days} ${getDayWord(days)}`;
    document.querySelector('.welcome-timer__hours').textContent = `${hours} час`;
    document.querySelector('.welcome-timer__minutes').textContent = `${minutes} мин`;
    document.querySelector('.welcome-timer__seconds').textContent = `${seconds} сек`;

    setTimeout(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', updateTimer);



const copyLinkElements = document.querySelectorAll('.copyLink');

function showNotification(message) {

    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;


    Object.assign(notification.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255,255,255,0.95)',
        color: 'black',
        padding: '15px 25px',
        borderRadius: '8px',
        fontSize: '16px',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        textAlign: 'center',
        transition: 'opacity 0.3s ease-in-out'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300); 
    }, 2000); 
}

copyLinkElements.forEach(element => {
    element.addEventListener('click', function() {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Ссылка скопирована');
            })
            .catch(err => {
                console.error('Ошибка при копировании: ', err);
                showNotification('Не удалось скопировать ссылку');
            });
    });
});