/* PDF modal — appears on click of "Получить исследование в PDF" CTAs
   (Figma 282:1092). Injects markup at end of <body>, wires open/close
   handlers; form submit is handled by sendsay.js. */
(function () {
    'use strict';

    var MODAL_HTML = ''
        + '<div class="pdf-modal" id="pdf-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title">'
        +   '<div class="pdf-modal__backdrop" data-pdf-close></div>'
        +   '<div class="pdf-modal__shell">'
        +   '<div class="pdf-modal__card">'
        +     '<img src="./img/figma/pdf_modal_swirl.png" class="pdf-modal__decor" alt="" aria-hidden="true" />'
        +     '<div class="pdf-modal__body">'
        +       '<p class="pdf-modal__title" id="pdf-modal-title">На&nbsp;оставленный вами адрес мы&nbsp;пришлём полный текст исследования и&nbsp;анонсы</p>'
        +       '<form class="pdf-modal__form" action="https://api.sendsay.com/general/api/v100/json/mdoo" method="POST">'
        +         '<input type="text" name="name" class="pdf-modal__input" placeholder="Имя*" minlength="2" required />'
        +         '<input type="email" name="email" class="pdf-modal__input" placeholder="Электронная почта*" autocomplete="email" required />'
        +         '<div class="pdf-modal__checks">'
        +           '<label class="pdf-modal__check">'
        +             '<input type="checkbox" class="pdf-modal__check-input" required />'
        +             '<span class="pdf-modal__check-text">Я&nbsp;принимаю <a href="https://rubitime.com/agreements/user-agreement" target="_blank" rel="noopener">условия пользовательского соглашения</a></span>'
        +           '</label>'
        +           '<label class="pdf-modal__check">'
        +             '<input type="checkbox" class="pdf-modal__check-input" required />'
        +             '<span class="pdf-modal__check-text"><a href="https://sredasvoih.com/terms/" target="_blank" rel="noopener">Согласие на&nbsp;обработку персональных данных</a></span>'
        +           '</label>'
        +         '</div>'
        +         '<button type="submit" class="pdf-modal__submit">Получить исследование</button>'
        +       '</form>'
        +     '</div>'
        +   '</div>'
        +   '<button type="button" class="pdf-modal__close" aria-label="Закрыть" data-pdf-close>'
        +     '<img src="./img/figma/pdf_modal_close.png" alt="" aria-hidden="true" />'
        +   '</button>'
        +   '</div>'
        + '</div>';

    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    var modal = document.getElementById('pdf-modal');
    if (!modal) return;

    function open() {
        modal.classList.add('pdf-modal--open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
    }

    function close() {
        modal.classList.remove('pdf-modal--open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /* Trigger: any element matching these selectors opens the modal.
       PreventDefault so anchor hrefs don't navigate. */
    var triggerSelector = '.fs-f2__cta-pdf, .fs-f11__cta-pdf, [data-pdf-trigger]';
    document.addEventListener('click', function (e) {
        var trigger = e.target.closest ? e.target.closest(triggerSelector) : null;
        if (trigger) {
            e.preventDefault();
            open();
            return;
        }
        var closer = e.target.closest ? e.target.closest('[data-pdf-close]') : null;
        if (closer) {
            close();
        }
    });

    /* Close on Esc. */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('pdf-modal--open')) {
            close();
        }
    });
})();
