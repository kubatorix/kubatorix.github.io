/* Site footer component.
   Mounts the shared footer markup into <footer id="site-footer"></footer>.
   Loaded with `defer` BEFORE sendsay.js so the .subscribe form exists when
   sendsay.js wires the Sendsay handler. */
(function () {
    function siteRoot() {
        var segments = location.pathname.split('/').filter(Boolean);
        if (segments.length && /\.html?$/i.test(segments[segments.length - 1])) {
            segments.pop();
        }
        if (!segments.length) return '';
        return Array(segments.length + 1).join('../');
    }

    var root = siteRoot();

    var FOOTER_HTML = ''
        + '<div class="footer-block footer-block__1">'
        +   '<div class="footer-wrap1">'
        +     '<a href="https://sredasvoih.com/?utm_source=site&amp;utm_medium=email&amp;utm_campaign=spec&amp;utm_term=fundraising" target="_blank" onclick="window.open(\'https://sredasvoih.ru/?utm_source=site&utm_medium=email&utm_campaign=spec&utm_term=fundraising\',\'_blank\',\'noopener,noreferrer\'); return false;">'
        +       '<img src="' + root + 'img/icons/logo_footer.svg" class="footer-logo" alt="" />'
        +     '</a>'
        +     '<p class="footer-text1">Пространство в&nbsp;Москве<br />для благотворительных проектов и&nbsp;тех, кто их&nbsp;создаёт.</p>'
        +   '</div>'
        +   '<p class="footer-text2">Участвуйте в&nbsp;программе и&nbsp;используйте студии, помещения, образовательные модули и&nbsp;другие ресурсы для ваших социальных проектов.</p>'
        +   '<div class="footer-wrap2">'
        +     '<div class="footer-wrap3">'
        +       '<a href="' + root + 'about.html" class="footer-link1">Об&nbsp;организаторах</a>'
        +       '<div class="footer-wrap4">'
        +         '<a href="https://t.me/sredasvoih?utm_source=site&amp;utm_medium=spec&amp;utm_campaign=landing_pade" target="_blank" onclick="window.open(\'https://t.me/sredasvoih?utm_source=site&utm_medium=spec&utm_campaign=landing_pade\',\'_blank\',\'noopener,noreferrer\'); return false;">'
        +           '<img src="' + root + 'img/icons/tg.svg" class="footer-social" alt="" />'
        +         '</a>'
        +         '<a href="https://vk.ru/sredasvoih?utm_source=site&amp;utm_medium=spec&amp;utm_campaign=landing_pade" target="_blank" onclick="window.open(\'https://vk.ru/sredasvoih?utm_source=site&utm_medium=spec&utm_campaign=landing_pade\',\'_blank\',\'noopener,noreferrer\'); return false;">'
        +           '<img src="' + root + 'img/icons/vk.svg" class="footer-social" alt="" />'
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
