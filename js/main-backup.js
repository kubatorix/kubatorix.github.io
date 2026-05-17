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

    // Deterministic PRNG (mulberry32) — used only for the startAngle so the
    // rotation of letters during the assembly tween is stable across loads.
    function makeRng(seed) {
        let s = seed >>> 0;
        return function () {
            s = (s + 0x6D2B79F5) >>> 0;
            let t = s;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /* Scattered start positions extracted from Figma 219:322 (portraits
       frame, 1518.94 × 331.93). Each column was independently normalised
       to its half of the 1100 × 400 canvas: purple → x 0..550, orange →
       x 550..1100. Letters cycle through the pool when the rendered text
       has more particles than positions in the macet. */
    const PURPLE_POS = [[234.7,171.1],[442.4,171.6],[476.7,299.7],[238.6,240.0],[335.3,240.3],[265.0,269.8],[199.4,225.7],[10.0,210.2],[147.1,195.3],[105.1,151.8],[105.1,132.4],[123.3,180.9],[416.6,204.2],[502.6,240.7],[413.4,254.4],[205.3,93.7],[308.4,171.6],[425.5,180.6],[321.5,210.2],[197.1,60.8],[210.4,75.7],[215.8,31.6],[384.2,146.9],[520.0,195.7],[353.2,94.1],[372.2,93.7],[287.5,10.0],[356.7,31.8],[277.3,55.0],[83.4,309.0],[340.0,13.7],[498.4,60.8],[429.8,60.8],[283.5,93.5],[396.1,92.5],[415.0,121.2],[537.3,60.8],[540.0,120.5],[463.5,31.8],[151.4,93.7],[220.1,121.5],[105.1,93.7],[149.4,123.4],[242.7,132.4],[323.2,135.4],[396.5,121.2],[316.8,105.5],[335.7,269.8],[530.4,269.8],[279.8,300.4],[312.0,358.2],[21.9,269.8],[226.7,209.5],[370.1,194.9],[296.2,240.7],[384.2,238.3],[137.0,262.0],[215.3,300.4],[107.1,390.0],[146.1,61.9],[152.4,32.9],[138.2,32.5],[60.3,45.8],[123.3,11.2]];
    const ORANGE_POS = [[1072.2,340.1],[1090.0,389.2],[992.3,390.0],[816.0,26.1],[836.6,91.8],[916.4,26.1],[669.4,74.5],[643.8,109.0],[688.7,10.0],[1063.6,238.9],[926.6,357.0],[838.6,338.4],[864.8,306.7],[865.1,386.3],[875.6,357.0],[823.1,390.0],[669.5,338.4],[620.2,306.7],[608.6,356.6],[766.8,338.4],[711.7,373.5],[955.4,296.0],[985.3,321.2],[1047.1,288.3],[940.3,295.6],[735.7,292.3],[560.0,316.6],[947.9,388.3],[977.8,357.0],[1079.6,12.8],[813.6,292.4],[751.3,388.3],[761.0,372.7],[813.1,390.0],[803.5,356.2],[597.1,356.6],[561.7,388.3],[1037.7,109.4],[993.1,217.8],[1018.4,273.7],[975.9,174.7],[1022.4,308.2],[852.5,250.5],[916.9,305.8],[883.2,207.7],[859.6,191.1],[816.2,240.7],[643.5,247.1],[746.7,292.3],[745.0,217.8],[700.5,224.9],[691.7,292.3],[798.2,241.5],[938.4,210.0],[958.0,158.1],[911.9,241.5],[1031.0,203.3],[688.8,191.9],[750.0,158.3],[772.0,225.0],[666.3,225.0],[837.7,160.3],[917.9,106.5],[1015.6,109.4],[816.4,210.0],[885.5,291.0],[773.5,95.3],[824.5,92.9],[1076.3,151.5],[1015.6,205.0],[666.1,141.8],[700.5,141.4],[705.5,108.6],[772.6,141.4],[950.7,75.0],[962.1,110.7],[986.7,26.1],[886.0,69.3]];

    function init() {
        const isMobile = window.innerWidth < 770;
        const rand = makeRng(0xC0FFEE);

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
            // On desktop: use the Figma-extracted scatter positions for each
            // column. On mobile we keep random-style scatter inside each
            // stacked half because the макет positions don't fit the narrow
            // single-column layout.
            const isPurple = isFirst;
            const pool = isPurple ? PURPLE_POS : ORANGE_POS;
            let poolI = 0;
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
            // Mobile pool scaling: stretch the Figma half (550x400) into
            // the mobile column zone so positions still look like the макет.
            function mobilePos(figmaXY) {
                const halfW_src = 550;
                const halfH_src = 400;
                // map figma x (0..1100) within column to mobile x (0..canvas.width)
                const fx = isPurple ? figmaXY[0] : (figmaXY[0] - halfW_src);
                const nx = fx / halfW_src * canvas.width;
                const ny = yMin + figmaXY[1] / halfH_src * (yMax - yMin);
                return [nx, ny];
            }

            words.forEach(word => {
                const wordWidth = ctx.measureText(word + ' ').width;
                if (currentX + wordWidth > textX + textWidth) {
                    currentX = textX;
                    currentY += lineHeight;
                }

                for (let char of (word + ' ')) {
                    const charWidth = ctx.measureText(char).width;
                    const figmaXY = pool[poolI % pool.length];
                    poolI++;
                    const start = isMobile ? mobilePos(figmaXY) : figmaXY;
                    particles.push({
                        char: char,
                        color: t.color,

                        targetX: currentX,
                        targetY: currentY,

                        startX: start[0],
                        startY: start[1],

                        startAngle: (rand() - 0.5) * Math.PI
                    });
                    currentX += charWidth;
                }
            });
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Text fully assembles by 80 % of the slider travel — the last 20 %
        // keeps the letters locked at their target positions.
        const progress = Math.min(1, parseFloat(slider.value) / 0.8);

        particles.forEach(p => {
            const x = p.startX + (p.targetX - p.startX) * progress;
            const y = p.startY + (p.targetY - p.startY) * progress;

            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = p.color;
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