/* Site header component.
   Mounts the shared header HTML (burger icon + top nav + burger-menu overlay)
   into <div id="site-header"></div> or [data-site-header].
   Loaded with `defer` BEFORE common.js/main.js so the topnav popup and burger
   elements exist when those scripts attach their handlers.
   Active page is detected from location.pathname. */
(function () {
    'use strict';

    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === '' || path === '/') path = 'index.html';

    var pathnameLower = location.pathname.toLowerCase();
    var isResearchPage = path === 'research.html'
        || /\/research\.html$/.test(pathnameLower)
        || /\/research\/?$/.test(pathnameLower)
        || /\/research\/index\.html$/.test(pathnameLower);
    var isArticlePage = /\/articles\/\d+/.test(pathnameLower);
    var isExperiencePage = path === 'experience.html';
    var showSiteBrand = path === 'index.html' || isResearchPage || isExperiencePage;

    function siteRoot() {
        var segments = location.pathname.split('/').filter(Boolean);
        if (segments.length && /\.html?$/i.test(segments[segments.length - 1])) {
            segments.pop();
        }
        if (!segments.length) return '';
        return Array(segments.length + 1).join('../');
    }

    var root = siteRoot();

    function topnavActive(slug) {
        if (isArticlePage && slug === 'index.html') return '';
        return path === slug ? ' topnav__link--active' : '';
    }
    function issledovanieActive() {
        return isResearchPage ? ' topnav__link--active' : '';
    }
    function opytActive() {
        return path === 'experience.html' || isArticlePage ? ' topnav__link--active' : '';
    }
    function burgerActive(slug) {
        if (isArticlePage && slug === 'index.html') return '';
        return path === slug ? ' active' : '';
    }
    function burgerIssledovanieActive() {
        return isResearchPage ? ' active' : '';
    }
    function burgerOpytActive() {
        return path === 'experience.html' || isArticlePage ? ' active' : '';
    }

    var BURGER_ICON_HTML = ''
        + '<button type="button" class="header-burger__icon" aria-label="Открыть меню" aria-expanded="false">'
        +   '<svg class="header-burger__icon-burger" width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        +     '<path d="M0 1.24765C0 1.93671 0.558592 2.4953 1.24765 2.4953H18.7523C19.4414 2.4953 20 1.93671 20 1.24765C20 0.558592 19.4414 0 18.7523 0H1.24765C0.558592 0 0 0.558592 0 1.24765Z" fill="currentColor"/>'
        +     '<path d="M0 15.2242C0 15.9133 0.558592 16.4719 1.24765 16.4719H18.7523C19.4414 16.4719 20 15.9133 20 15.2242C20 14.5352 19.4414 13.9766 18.7523 13.9766H1.24765C0.558592 13.9766 0 14.5352 0 15.2242Z" fill="currentColor"/>'
        +     '<path d="M0 8.23202C0 8.92108 0.558592 9.47967 1.24765 9.47967H18.7523C19.4414 9.47967 20 8.92108 20 8.23202C20 7.54297 19.4414 6.98438 18.7523 6.98438H1.24765C0.558592 6.98438 0 7.54297 0 8.23202Z" fill="currentColor"/>'
        +   '</svg>'
        +   '<svg class="header-burger__icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        +     '<path d="M1.17993 1.17983L22.6094 22.6093" stroke="currentColor" stroke-width="2.35967" stroke-linecap="round" stroke-linejoin="round"/>'
        +     '<path d="M22.6096 1.18006L1.18013 22.6095" stroke="currentColor" stroke-width="2.35967" stroke-linecap="round" stroke-linejoin="round"/>'
        +   '</svg>'
        + '</button>';

    var HEADER_HTML = ''
        + '<header>'
        +   '<div class="container">'
        +     '<nav class="topnav header_inside">'
        +       '<a href="' + root + 'index.html" class="topnav__link topnav__link--tema' + topnavActive('index.html') + ' header_inside-item">Тема</a>'
        +       '<a href="' + root + 'research.html" class="topnav__link topnav__link--issledovanie' + issledovanieActive() + ' header_inside-item">Исследование</a>'
        +       '<div class="topnav__hr" aria-hidden="true"></div>'
        +       '<a href="' + root + 'experience.html" class="topnav__link topnav__link--opyt' + opytActive() + ' header_inside-item">Опыт</a>'
        +       '<a href="javascript:void(0);" class="topnav__link topnav__link--sobytiya header_inside-item" aria-haspopup="true" aria-expanded="false" aria-controls="topnav-events-popup">'
        +         '<span class="topnav__label">События</span>'
        +         '<svg class="topnav__plus" width="9.92" height="9.92" viewBox="0 0 9.92 9.92" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        +           '<line class="topnav__plus-v" x1="4.96" y1="0" x2="4.96" y2="9.92" stroke="currentColor" stroke-width="0.816"/>'
        +           '<line x1="0" y1="4.96" x2="9.92" y2="4.96" stroke="currentColor" stroke-width="0.816"/>'
        +         '</svg>'
        +       '</a>'
        +       '<a href="' + root + 'about.html" class="topnav__link topnav__link--about' + topnavActive('about.html') + ' header_inside-item">Об организаторах</a>'
        +       '<div class="topnav__events-popup" id="topnav-events-popup" role="menu" aria-hidden="true"></div>'
        +     '</nav>'
        +   '</div>'
        + '</header>';

    var BURGER_MENU_HTML = ''
        + '<div class="burger-menu__bg"></div>'
        + '<div class="burger-menu">'
        +   '<div class="burger-menu__wrap">'
        +     '<div>'
        +       '<img src="' + root + 'img/icons/burger_menu__close.svg" class="burger-menu__close" />'
        +       '<div class="header_inside">'
        +         '<div class="header_inside-wrap">'
        +           '<a href="' + root + 'index.html" class="header_inside-item' + burgerActive('index.html') + '">Тема</a>'
        +           '<a href="' + root + 'research.html" class="header_inside-item' + burgerIssledovanieActive() + '">Исследование</a>'
        +           '<a href="' + root + 'experience.html" class="header_inside-item' + burgerOpytActive() + '">Опыт</a>'
        +         '</div>'
        +         '<div class="header_inside-wrap">'
        +           '<a href="javascript:void(0);" class="header_inside-item header_inside-item_custom2 burger-menu__events-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="burger-events-popup">'
        +             'События<img src="' + root + 'img/icons/plus.svg" />'
        +           '</a>'
        +           '<div class="burger-menu__events-popup" id="burger-events-popup" role="menu" aria-hidden="true"></div>'
        +           '<a href="' + root + 'about.html" class="header_inside-item' + burgerActive('about.html') + '">Об&nbsp;организаторах</a>'
        +         '</div>'
        +       '</div>'
        +     '</div>'
        +     '<div>'
        +       '<p class="burger-menu__text1">спецпроект</p>'
        +       '<a href="https://sredasvoih.com/" target="_blank">'
        +         '<img src="' + root + 'img/figma/logo_specproject.svg" class="burger-menu__logo" />'
        +       '</a>'
        +       '<div class="footer-wrap4">'
        +         '<a href="https://t.me/sredasvoih?utm_source=site&utm_medium=spec&utm_campaign=landing_pade" target="_blank" onclick="window.open(\'https://t.me/sredasvoih?utm_source=site&utm_medium=spec&utm_campaign=landing_pade\',\'_blank\',\'noopener,noreferrer\'); return false;"><img src="' + root + 'img/icons/tg.svg" class="footer-social" /></a>'
        +         '<a href="https://vk.ru/sredasvoih?utm_source=site&utm_medium=spec&utm_campaign=landing_pade" target="_blank" onclick="window.open(\'https://vk.ru/sredasvoih?utm_source=site&utm_medium=spec&utm_campaign=landing_pade\',\'_blank\',\'noopener,noreferrer\'); return false;"><img src="' + root + 'img/icons/vk.svg" class="footer-social" /></a>'
        +       '</div>'
        +     '</div>'
        +   '</div>'
        + '</div>';

    var SITE_BRAND_INNER = ''
        + '<span class="site-brand__word">спецпроект</span>'
        + '<img src="' + root + 'img/figma/logo_specproject.svg" alt="СРЕДА_СВОИХ" class="site-brand__logo site-brand__logo--on-dark" width="191" height="19" />'
        + '<img src="' + root + 'img/figma/exp_hero_brand_logo.svg" alt="СРЕДА_СВОИХ" class="site-brand__logo site-brand__logo--on-light" width="191" height="19" />';

    var SITE_BRAND_HTML = '';
    if (showSiteBrand) {
        if (isExperiencePage) {
            SITE_BRAND_HTML = ''
                + '<div class="site-brand" aria-label="Спецпроект Среда своих">'
                +   '<a href="https://sredasvoih.ru/?utm_source=site&amp;utm_medium=email&amp;utm_campaign=spec&amp;utm_term=fundraising" target="_blank" rel="noopener" class="site-brand__inner site-brand__link"'
                +     ' onclick="window.open(\'https://sredasvoih.ru/?utm_source=site&utm_medium=email&utm_campaign=spec&utm_term=fundraising\',\'_blank\',\'noopener,noreferrer\'); return false;">'
                +     SITE_BRAND_INNER
                +   '</a>'
                + '</div>';
        } else {
            SITE_BRAND_HTML = ''
                + '<div class="site-brand" aria-label="Спецпроект Среда своих">'
                +   '<div class="site-brand__inner">'
                +     SITE_BRAND_INNER
                +   '</div>'
                + '</div>';
        }
    }

    /* The burger icon + topnav go at the original placeholder position (top of
       body). The burger-menu overlay (.burger-menu__bg + .burger-menu) is
       appended to the END of body — matching the original page structure
       where it always sat after the main content. This matters because the
       stylesheet uses `.container-wrapper:nth-of-type(1) > … > .container`
       to un-pad the hero on index.html: if burger-menu divs came before
       .container-wrapper, that selector would no longer match. */
    var mounts = document.querySelectorAll('#site-header, [data-site-header]');
    for (var i = 0; i < mounts.length; i++) {
        mounts[i].outerHTML = BURGER_ICON_HTML + HEADER_HTML + SITE_BRAND_HTML;
    }
    if (showSiteBrand) {
        document.body.classList.add('has-site-brand');
    }
    document.body.insertAdjacentHTML('beforeend', BURGER_MENU_HTML);
})();
