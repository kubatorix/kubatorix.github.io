/* Site footer component.
   Mounts the shared footer markup into <footer id="site-footer"></footer>.
   Loaded with `defer` BEFORE common.js so the .subscribe form exists when
   common.js attaches its DOMContentLoaded handler. */
(function () {
    var FOOTER_HTML = ''
        + '<div class="footer-block footer-block__1">'
        +   '<div class="footer-wrap1">'
        +     '<a href="https://sredasvoih.com/?utm_source=site&amp;utm_medium=email&amp;utm_campaign=spec&amp;utm_term=fundraising" target="_blank">'
        +       '<img src="./img/icons/logo_footer.svg" class="footer-logo" alt="" />'
        +     '</a>'
        +     '<p class="footer-text1">Пространство в&nbsp;CITYе<br />для благотворительных проектов и&nbsp;тех, кто их&nbsp;создаёт.</p>'
        +   '</div>'
        +   '<p class="footer-text2">Участвуйте в&nbsp;программе и&nbsp;используйте студии, помещения, образовательные модули и&nbsp;другие ресурсы для ваших социальных проектов.</p>'
        +   '<div class="footer-wrap2">'
        +     '<div class="footer-wrap3">'
        +       '<a href="./about.html" class="footer-link1">Об&nbsp;организаторах</a>'
        +       '<div class="footer-wrap4">'
        +         '<a href="https://t.me/sredasvoih?utm_source=site&amp;utm_medium=email&amp;utm_campaign=spec&amp;utm_term=fundraising" target="_blank">'
        +           '<img src="./img/icons/tg.svg" class="footer-social" alt="" />'
        +         '</a>'
        +         '<a href="https://vk.com/sredasvoih?utm_source=site&amp;utm_medium=email&amp;utm_campaign=spec&amp;utm_term=fundraising" target="_blank">'
        +           '<img src="./img/icons/vk.svg" class="footer-social" alt="" />'
        +         '</a>'
        +       '</div>'
        +     '</div>'
        +     '<p class="footer-text3">2026</p>'
        +   '</div>'
        + '</div>'
        + '<div class="footer-block footer-block__2">'
        +   '<p class="footer-text4">Подпишитесь на&nbsp;анонсы Среды, чтобы не&nbsp;пропускать события в&nbsp;рамках этого и&nbsp;других проектов</p>'
        +   '<form action="https://api.sendsay.com/general/api/v100/json/mdoo" method="POST" class="subscribe">'
        +     '<input type="email" name="email" class="footer-input footer-input__email" autocomplete="email" placeholder="Электронная почта*" required="" />'
        +     '<input type="text" name="name" class="footer-input footer-input__name" minlength="2" placeholder="Имя*" required="" />'
        +     '<div class="footer-checkbox__wrap">'
        +       '<label class="footer-checkbox__label">'
        +         '<input type="checkbox" name="footer-checkbox__agreement" required="" class="footer-checkbox__input" />'
        +         '<span class="footer-checkbox__span">Я&nbsp;принимаю <a href="https://rubitime.com/agreements/user-agreement" target="_blank" class="footer-checkbox__link">условия пользовательского соглашения</a></span>'
        +       '</label>'
        +       '<label class="footer-checkbox__label">'
        +         '<input type="checkbox" name="footer-checkbox__agreement" required="" class="footer-checkbox__input" />'
        +         '<span class="footer-checkbox__span"><a href="https://sredasvoih.com/terms/" target="_blank" class="footer-checkbox__link">Согласие на&nbsp;обработку персональных данных</a></span>'
        +       '</label>'
        +     '</div>'
        +     '<button type="submit" class="footer-btn">Подписаться</button>'
        +   '</form>'
        + '</div>';

    var mounts = document.querySelectorAll('footer#site-footer, [data-site-footer]');
    for (var i = 0; i < mounts.length; i++) {
        mounts[i].innerHTML = FOOTER_HTML;
    }
})();
