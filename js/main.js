/* Site-wide interactive behaviour.
   Loaded with `defer`, so the script runs after the DOM is parsed. Each
   feature is wrapped in an IIFE that bails out early if its target
   element is missing — phases can be removed from the page without
   breaking the others. */

/* ============================================================
   Events data — single source for the desktop topnav popup AND
   the mobile burger-menu popup. Add/remove/edit entries here
   only; renderEventsInto() fills both popups identically.
   Each item: { date, title, href }. Title may include HTML
   entities (e.g. &nbsp;).
   ============================================================ */
var EVENTS = [
    { date: '29 мая',     title: 'Урок в&nbsp;Среде. Как найти фандрайзера? Событие с&nbsp;Иваном Сосискиным', href: '#' },
    { date: '29 августа', title: 'Урок в&nbsp;Среде. Как найти фандрайзера? Событие с&nbsp;Иваном Сосискиным', href: '#' },
    { date: '29 мая',     title: 'Урок в&nbsp;Среде. Как найти фандрайзера?',                                  href: '#' }
];

/* `prefix` is the BEM block name used for child class names — passing
   'topnav' yields .topnav__events-item / -date / -title. */
function renderEventsInto(container, prefix) {
    if (!container) return;
    container.innerHTML = EVENTS.map(function (e) {
        return '<a href="' + (e.href || '#') + '" class="' + prefix + '__events-item" role="menuitem">' +
                   '<span class="' + prefix + '__events-date">' + e.date + '</span>' +
                   '<span class="' + prefix + '__events-title">' + e.title + '</span>' +
               '</a>';
    }).join('');
}
renderEventsInto(document.querySelector('.topnav__events-popup'),     'topnav');
renderEventsInto(document.querySelector('.burger-menu__events-popup'), 'burger-menu');

/* ============================================================
   Phase 5 — Section 3+4 segment toggle.
   Both the top and bottom toggles drive a single
   [data-state="fundraisers" | "both" | "employers"] on
   .section3__phase5; CSS reacts. fundraisers/employers also
   counts the active mega-number from 0 to its target (46,7% /
   71,7%): coarse 1.5 steps far from target, fine 0.3 inside the
   last 5 units.
   ============================================================ */
(function () {
    var section = document.querySelector('.section3__phase5');
    if (!section) return;
    var segs = section.querySelectorAll('.s3p5__seg[data-action]');
    var orangeNum = section.querySelector('.s3p5__mega-num--orange');
    var purpleNum = section.querySelector('.s3p5__mega-num--purple');

    function readTarget(el) {
        var d = el.querySelector('.s3p5__mega-digits').textContent.trim();
        var s = el.querySelector('.s3p5__mega-suffix').textContent.trim();
        var decMatch = s.match(/[,.](\d+)/);
        var dec = decMatch ? parseInt(decMatch[1], 10) / Math.pow(10, decMatch[1].length) : 0;
        return parseInt(d, 10) + dec;
    }
    function readSuffixTail(el) {
        var s = el.querySelector('.s3p5__mega-suffix').textContent;
        var m = s.match(/[,.]\d+(.*)$/);
        return m ? m[1] : '';
    }
    function writeNum(el, value, finalDigits, finalSuffix, done) {
        var digitsEl = el.querySelector('.s3p5__mega-digits');
        var suffixEl = el.querySelector('.s3p5__mega-suffix');
        if (done) {
            digitsEl.textContent = finalDigits;
            suffixEl.textContent = finalSuffix;
            return;
        }
        var intPart = Math.floor(value);
        var decPart = Math.round((value - intPart) * 10);
        if (decPart === 10) { intPart += 1; decPart = 0; }
        digitsEl.textContent = String(intPart);
        suffixEl.textContent = ',' + decPart + readSuffixTail(el);
    }

    var origText = {
        orange: orangeNum ? {
            d: orangeNum.querySelector('.s3p5__mega-digits').textContent,
            s: orangeNum.querySelector('.s3p5__mega-suffix').textContent,
            target: readTarget(orangeNum)
        } : null,
        purple: purpleNum ? {
            d: purpleNum.querySelector('.s3p5__mega-digits').textContent,
            s: purpleNum.querySelector('.s3p5__mega-suffix').textContent,
            target: readTarget(purpleNum)
        } : null
    };

    var animToken = 0;
    function animateMega(el, snap) {
        if (!el || !snap) return;
        var myToken = ++animToken;
        var v = 0;
        var lastTick = performance.now();
        var INTERVAL = 22;
        var COARSE = 2;
        var FINE = 0.3;
        writeNum(el, 0, snap.d, snap.s, false);
        function tick(now) {
            if (myToken !== animToken) return;
            if (now - lastTick >= INTERVAL) {
                lastTick = now;
                var remaining = snap.target - v;
                var step = remaining > 5 ? COARSE : FINE;
                v = Math.min(snap.target, v + step);
                writeNum(el, v, snap.d, snap.s, false);
            }
            if (v < snap.target) requestAnimationFrame(tick);
            else writeNum(el, v, snap.d, snap.s, true);
        }
        requestAnimationFrame(tick);
    }
    function restoreMega(el, snap) {
        if (!el || !snap) return;
        ++animToken;
        writeNum(el, 0, snap.d, snap.s, true);
    }

    function setState(state) {
        section.setAttribute('data-state', state);
        segs.forEach(function (s) {
            s.setAttribute('aria-pressed', s.dataset.action === state ? 'true' : 'false');
        });
        if (state === 'fundraisers') {
            restoreMega(orangeNum, origText.orange);
            animateMega(purpleNum, origText.purple);
        } else if (state === 'employers') {
            restoreMega(purpleNum, origText.purple);
            animateMega(orangeNum, origText.orange);
        } else {
            restoreMega(orangeNum, origText.orange);
            restoreMega(purpleNum, origText.purple);
        }
    }
    segs.forEach(function (seg) {
        seg.addEventListener('click', function () { setState(seg.dataset.action); });
    });
    setState(section.getAttribute('data-state') || 'both');
})();

/* ============================================================
   Hero — segmented toggle (fundraisers / for all / employers).
   Mirrors the s3p5 pattern: clicks set [data-state] on .hero,
   CSS does the rest (caption fade, figure rotation, pill swap,
   descriptor swap).
   ============================================================ */
(function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var segs = hero.querySelectorAll('.hero__toggle-segment[data-action]');
    function setState(state) {
        hero.setAttribute('data-state', state);
        segs.forEach(function (s) {
            s.setAttribute('aria-selected', s.dataset.action === state ? 'true' : 'false');
        });
    }
    segs.forEach(function (seg) {
        seg.addEventListener('click', function () { setState(seg.dataset.action); });
    });
    setState(hero.getAttribute('data-state') || 'both');
})();

/* ============================================================
   Phase 6 — Section 5 scroll-driven convergence + viewport
   scaling. --canvas-scale shrinks the 1336-wide canvas to fit
   narrower viewports. --phase6-progress: 0→1 as section scrolls
   into view; CSS interpolates polygon translateX so they slide
   in from left/right toward the center. At MERGE_AT, data-state
   flips to "merged" so fills fade in.
   ============================================================ */
(function () {
    var section = document.querySelector('.section5__phase6');
    if (!section) return;
    var CANVAS_W = 1336;
    var MERGE_AT = 0.9;
    var ticking = false;

    function setScale() {
        var w = section.clientWidth || window.innerWidth;
        var scale = Math.min(1, w / CANVAS_W);
        section.style.setProperty('--canvas-scale', scale.toFixed(4));
    }
    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        // Polygon mid-line is at ~61.5% of canvas height (canvas y=472 / 767).
        var polyMid = rect.top + rect.height * 0.615;
        var startY = vh;
        var endY = vh * 0.5;
        var progress = Math.max(0, Math.min(1, (startY - polyMid) / (startY - endY)));
        section.style.setProperty('--phase6-progress', progress.toFixed(4));
        section.setAttribute('data-state', progress >= MERGE_AT ? 'merged' : 'initial');
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }
    function onResize() { setScale(); onScroll(); }

    setScale();
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
})();

/* ============================================================
   Phase 7 — Section 6 viewport scaling + scroll-driven 360°
   rotation of the orbital rings. Progress 0..1 spans the full
   viewport sweep (section enters from below to fully past the
   top).
   ============================================================ */
(function () {
    var section = document.querySelector('.section6__phase7');
    if (!section) return;
    var CANVAS_W = 1440;
    var ticking = false;

    function setScale() {
        var w = section.clientWidth || window.innerWidth;
        var scale = Math.min(1, w / CANVAS_W);
        section.style.setProperty('--canvas-scale', scale.toFixed(4));
    }
    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        section.style.setProperty('--section6-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }
    function onResize() { setScale(); onScroll(); }

    setScale();
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
})();

/* ============================================================
   Phase 8 — Section 8 viewport scaling. Static (no scroll
   behaviour). Canvas is 1240; the 100px gutter is centralised
   on .container so the section just fits the container content
   area.
   ============================================================ */
(function () {
    var section = document.querySelector('.section8__phase8');
    if (!section) return;
    var CANVAS_W = 1240;
    function setScale() {
        var w = section.clientWidth || window.innerWidth;
        var scale = Math.min(1, w / CANVAS_W);
        section.style.setProperty('--canvas-scale', scale.toFixed(4));
    }
    setScale();
    window.addEventListener('resize', setScale);
})();

/* ============================================================
   Phase 8 — Section 8 card pager (desktop). Cards stay put; the
   pager only moves the lime "active" outline between the four
   cards. Prev disabled at index 0; next disabled at last index.
   ============================================================ */
(function () {
    var section = document.querySelector('.section8__phase8');
    if (!section) return;
    var track = section.querySelector('.s8__track');
    var prev  = section.querySelector('.s8__nav-btn--prev');
    var next  = section.querySelector('.s8__nav-btn--next');
    if (!track || !prev || !next) return;

    var cards = track.querySelectorAll('.s8__card');
    var MAX = Math.max(0, cards.length - 1);
    var index = 0;

    function update() {
        cards.forEach(function (c, i) {
            if (i === index) c.setAttribute('data-active', 'true');
            else c.removeAttribute('data-active');
        });
        track.dataset.index = String(index);
        prev.disabled = index <= 0;
        next.disabled = index >= MAX;
    }
    prev.addEventListener('click', function () {
        if (index > 0) { index--; update(); }
    });
    next.addEventListener('click', function () {
        if (index < MAX) { index++; update(); }
    });
    update();
})();

/* ============================================================
   Phase 8 — Mobile carousel dots. Clicking a dot scrolls the
   track to the matching card; scrolling/swiping updates the
   active dot. No-op on desktop (track has no horizontal
   overflow there).
   ============================================================ */
(function () {
    var section = document.querySelector('.section8__phase8');
    if (!section) return;
    var track = section.querySelector('.s8__track');
    var dots  = section.querySelectorAll('.s8__dot');
    if (!track || !dots.length) return;
    var cards = track.querySelectorAll('.s8__card');

    function setActive(i) {
        dots.forEach(function (d, j) {
            if (j === i) d.setAttribute('aria-current', 'true');
            else d.removeAttribute('aria-current');
        });
    }
    function nearestIndex() {
        var center = track.scrollLeft + track.clientWidth / 2;
        var bestI = 0, bestD = Infinity;
        cards.forEach(function (c, i) {
            var c2 = c.offsetLeft + c.offsetWidth / 2;
            var d = Math.abs(c2 - center);
            if (d < bestD) { bestD = d; bestI = i; }
        });
        return bestI;
    }
    var raf = 0;
    track.addEventListener('scroll', function () {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
            raf = 0;
            setActive(nearestIndex());
        });
    }, { passive: true });

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            var card = cards[i];
            if (!card) return;
            var pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
            track.scrollTo({ left: card.offsetLeft - pad, behavior: 'smooth' });
        });
    });
})();

/* ============================================================
   Phase 9 — Section 9 viewport scaling. Canvas is 1240; the
   100px gutter is centralised on .container.
   ============================================================ */
(function () {
    var section = document.querySelector('.section9__phase9');
    if (!section) return;
    var CANVAS_W = 1240;
    function setScale() {
        var w = section.clientWidth || window.innerWidth;
        var scale = Math.min(1, w / CANVAS_W);
        section.style.setProperty('--canvas-scale', scale.toFixed(4));
    }
    setScale();
    window.addEventListener('resize', setScale);
})();

/* ============================================================
   Phase 9 — Section 9 partner pager. Tracks an internal index
   across the 4 columns and toggles disabled state on the
   chevrons (no visual change to the columns — Figma shows no
   active highlight here).
   ============================================================ */
(function () {
    var section = document.querySelector('.section9__phase9');
    if (!section) return;
    var prev = section.querySelector('.s9__nav-btn--prev');
    var next = section.querySelector('.s9__nav-btn--next');
    if (!prev || !next) return;

    var cols = section.querySelectorAll('.s9__col');
    var MAX = Math.max(0, cols.length - 1);
    var index = 0;

    function update() {
        prev.disabled = index <= 0;
        next.disabled = index >= MAX;
    }
    prev.addEventListener('click', function () {
        if (index > 0) { index--; update(); }
    });
    next.addEventListener('click', function () {
        if (index < MAX) { index++; update(); }
    });
    update();
})();

/* ============================================================
   Phase 9 — Mobile carousel dots. Mirrors Phase 8: clicking a
   dot scrolls the track to the matching column, scrolling/
   swiping updates the active dot. No-op on desktop (track has
   display:contents — no horizontal overflow, scroll handler
   never fires).
   ============================================================ */
(function () {
    var section = document.querySelector('.section9__phase9');
    if (!section) return;
    var track = section.querySelector('.s9__track');
    var dots  = section.querySelectorAll('.s9__dot');
    if (!track || !dots.length) return;
    var cols = track.querySelectorAll('.s9__col');

    function setActive(i) {
        dots.forEach(function (d, j) {
            if (j === i) d.setAttribute('aria-current', 'true');
            else d.removeAttribute('aria-current');
        });
    }
    function nearestIndex() {
        var center = track.scrollLeft + track.clientWidth / 2;
        var bestI = 0, bestD = Infinity;
        cols.forEach(function (c, i) {
            var c2 = c.offsetLeft + c.offsetWidth / 2;
            var d = Math.abs(c2 - center);
            if (d < bestD) { bestD = d; bestI = i; }
        });
        return bestI;
    }
    var raf = 0;
    track.addEventListener('scroll', function () {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
            raf = 0;
            setActive(nearestIndex());
        });
    }, { passive: true });

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            var col = cols[i];
            if (!col) return;
            var pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
            track.scrollTo({ left: col.offsetLeft - pad, behavior: 'smooth' });
        });
    });
})();

/* ============================================================
   Topnav — events dropdown toggle. Click on "События" opens/
   closes the popup; click outside or Esc closes it. Toggling
   adds .topnav--events-open on .topnav so CSS can show the
   popup and swap the "+" icon for a dash.
   ============================================================ */
(function () {
    var nav = document.querySelector('.topnav');
    if (!nav) return;
    var btn = nav.querySelector('.topnav__link--sobytiya');
    var popup = nav.querySelector('.topnav__events-popup');
    if (!btn || !popup) return;

    function setOpen(open) {
        nav.classList.toggle('topnav--events-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        popup.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        setOpen(!nav.classList.contains('topnav--events-open'));
    });
    document.addEventListener('click', function (e) {
        if (!nav.classList.contains('topnav--events-open')) return;
        if (btn.contains(e.target) || popup.contains(e.target)) return;
        setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('topnav--events-open')) {
            setOpen(false);
        }
    });
})();

/* ============================================================
   Burger-menu — events dropdown toggle (mobile). Tapping
   "События" expands an in-flow list of events between the link
   and "Об организаторах". The "+" icon rotates to "×" while
   open (handled in CSS via the aria-expanded attribute).
   ============================================================ */
(function () {
    var menu = document.querySelector('.burger-menu');
    if (!menu) return;
    var toggle = menu.querySelector('.burger-menu__events-toggle');
    var popup = menu.querySelector('.burger-menu__events-popup');
    if (!toggle || !popup) return;

    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var open = !popup.classList.contains('is-open');
        popup.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        popup.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
})();
