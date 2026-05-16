document.addEventListener("DOMContentLoaded", function() {


    const canvas = document.getElementById('canvas');
    const slider = document.getElementById('slider');

    if (canvas && slider) {
    const ctx = canvas.getContext('2d');

    // Both columns target positions stay strictly inside their half of the
    // 1100-px canvas (split at x=550): purple фандрайзер in 80..480 (left),
    // orange наниматель in 620..1020 (right). Matches the scatter zones so
    // letters land cleanly on their own side when the slider hits 1.
    const texts = [
        {
            content: "Портрет современного фандрайзера: над чем он работает и о чём переживает, в каких условиях находится и что его мотивирует, чего ищет и что хочет изменить.",
            color: "#AA6EFF",
            x: 80, y: 100, width: 400
        },
        {
            content: "Портрет руководителя НКО или руководителя департамента, который фандрайзеров нанимает и фандрайзерами управляет: каков опыт работы с ними, насколько успешен поиск, каковы результаты и какие вызовы стоят.",
            color: "#FF6E32",
            x: 620, y: 180, width: 400
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

            // Scatter zone per column: desktop splits canvas left/right
            // (purple фандрайзер LEFT, orange наниматель RIGHT) at x=halfW.
            // Mobile stacks the columns vertically, so the scatter splits
            // top/bottom at y=halfH instead.
            const halfW = canvas.width / 2;
            const halfH = canvas.height / 2;
            const isFirst = index === 0;
            let xMin, xMax, yMin, yMax;
            if (isMobile) {
                xMin = 0;
                xMax = canvas.width;
                yMin = isFirst ? 0 : halfH;
                yMax = isFirst ? halfH : canvas.height;
            } else {
                xMin = isFirst ? 0 : halfW;
                xMax = isFirst ? halfW : canvas.width;
                yMin = 0;
                yMax = canvas.height;
            }

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

                        startX: xMin + Math.random() * (xMax - xMin),
                        startY: yMin + Math.random() * (yMax - yMin),

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
    }











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

    if (popup && popupBg) {
        const closePopup = () => {
            popup.style.display = 'none';
            popupBg.style.display = 'none';
        };

        if (closeButton) {
            closeButton.addEventListener('click', closePopup);
        }

        popupBg.addEventListener('click', (e) => {
            if (e.target === popupBg) {
                closePopup();
            }
        });

        const openButtons = document.querySelectorAll('.section7-btn, .welcome-btn');
        openButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                popupBg.style.display = 'block';
                popup.style.display = 'block';
            });
        });
    }






    
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
    
    var popupDays = document.querySelector('.popup-research__success-days');
    if (popupDays) popupDays.textContent = `${days} ${getDayWord(days)}`;
    var welcomeDays = document.querySelector('.welcome-timer__days');
    if (welcomeDays) welcomeDays.textContent = `${days} ${getDayWord(days)}`;
    var welcomeHours = document.querySelector('.welcome-timer__hours');
    if (welcomeHours) welcomeHours.textContent = `${hours} час`;
    var welcomeMinutes = document.querySelector('.welcome-timer__minutes');
    if (welcomeMinutes) welcomeMinutes.textContent = `${minutes} мин`;
    var welcomeSeconds = document.querySelector('.welcome-timer__seconds');
    if (welcomeSeconds) welcomeSeconds.textContent = `${seconds} сек`;

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