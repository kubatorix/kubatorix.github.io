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
   Segment-toggle wiring — used by both:
     • .section3__phase5  (s3p5 mega numbers, .s3p5__mega-* hooks)
     • .fs-f4             (FullStudy F4 graph numbers, .fs-f4__graph-* hooks)

   Both segment toggles drive a [data-state="fundraisers" | "both" |
   "employers"] on the host section. CSS reacts visually; this JS adds the
   number count-up animation: when the user picks "fundraisers", the
   PURPLE-side number counts from 0 to its target (purple = фандрайзер
   side); for "employers", the ORANGE side counts. "both" snaps both back
   to their final value with no animation.

   Stepping: coarse 2 when far from target, fine 0.3 inside the last 5
   units, ~22 ms tick interval. The counter is decimal-aware via the
   suffix shape — if the original suffix has ",7%" / ",3%" the animated
   suffix updates to ",N" + tail; if the suffix has no decimal (e.g. "%"
   for "70%") the suffix is preserved as-is and only the digit counts.
   ============================================================ */
(function () {
    function wireToggle(cfg) {
        var section = typeof cfg.section === 'string'
            ? document.querySelector(cfg.section)
            : cfg.section;
        if (!section) return;
        var segs       = section.querySelectorAll(cfg.segSel);
        var orangeNum  = cfg.orangeNumSel ? section.querySelector(cfg.orangeNumSel) : null;
        var purpleNum  = cfg.purpleNumSel ? section.querySelector(cfg.purpleNumSel) : null;
        var digitsSel  = cfg.digitsSel;
        var suffixSel  = cfg.suffixSel;

        function readTarget(el) {
            var d = el.querySelector(digitsSel).textContent.trim();
            var s = el.querySelector(suffixSel).textContent.trim();
            var decMatch = s.match(/[,.](\d+)/);
            var dec = decMatch ? parseInt(decMatch[1], 10) / Math.pow(10, decMatch[1].length) : 0;
            return parseInt(d, 10) + dec;
        }
        function readSuffixTail(el) {
            var s = el.querySelector(suffixSel).textContent;
            var m = s.match(/[,.]\d+(.*)$/);
            return m ? m[1] : '';
        }
        function writeNum(el, value, finalDigits, finalSuffix, done) {
            var digitsEl = el.querySelector(digitsSel);
            var suffixEl = el.querySelector(suffixSel);
            if (done) {
                digitsEl.textContent = finalDigits;
                suffixEl.textContent = finalSuffix;
                return;
            }
            var intPart = Math.floor(value);
            var decPart = Math.round((value - intPart) * 10);
            if (decPart === 10) { intPart += 1; decPart = 0; }
            digitsEl.textContent = String(intPart);
            // Only show ",N" during animation if the final suffix has a decimal
            // ("70%" stays "70%" while counting; "47,3%" becomes "12,0%" → "47,3%").
            if (/[,.](\d+)/.test(finalSuffix)) {
                suffixEl.textContent = ',' + decPart + readSuffixTail(el);
            } else {
                suffixEl.textContent = finalSuffix;
            }
        }

        var origText = {
            orange: orangeNum ? {
                d: orangeNum.querySelector(digitsSel).textContent,
                s: orangeNum.querySelector(suffixSel).textContent,
                target: readTarget(orangeNum)
            } : null,
            purple: purpleNum ? {
                d: purpleNum.querySelector(digitsSel).textContent,
                s: purpleNum.querySelector(suffixSel).textContent,
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
    }

    // s3p5 (index section 3+4) — top + bottom toggles operate independently.
    // Top group hosts the mega numbers (count-up animation runs here).
    // Bottom group has no count-up — only fades outline + body paragraphs.
    document.querySelectorAll('.section3__phase5 .s3p5__group--top').forEach(function (group) {
        wireToggle({
            section:      group,
            segSel:       '.s3p5__seg[data-action]',
            orangeNumSel: '.s3p5__mega-num--orange',
            purpleNumSel: '.s3p5__mega-num--purple',
            digitsSel:    '.s3p5__mega-digits',
            suffixSel:    '.s3p5__mega-suffix'
        });
    });
    document.querySelectorAll('.section3__phase5 .s3p5__group--bottom').forEach(function (group) {
        wireToggle({
            section: group,
            segSel:  '.s3p5__seg[data-action]'
        });
    });

    // FullStudy F4 — same toggle markup (.s3p5__seg) but graph numbers
    // use .fs-f4__graph-* class names.
    wireToggle({
        section:      '.fs-f4',
        segSel:       '.s3p5__seg[data-action]',
        orangeNumSel: '.fs-f4__graph-num--orange',
        purpleNumSel: '.fs-f4__graph-num--purple',
        digitsSel:    '.fs-f4__graph-digits',
        suffixSel:    '.fs-f4__graph-suffix'
    });

    // FullStudy F8 — has TWO synced toggles + a chromatic mega number pair
    // (30,2% / 58,8%) that animate count-up on toggle. Reuses the s3p5__mega
    // class structure so animateMega works as-is.
    wireToggle({
        section:      '.fs-f8',
        segSel:       '.s3p5__seg[data-action]',
        orangeNumSel: '.fs-f8__mega-1 .s3p5__mega-num--orange',
        purpleNumSel: '.fs-f8__mega-1 .s3p5__mega-num--purple',
        digitsSel:    '.s3p5__mega-digits',
        suffixSel:    '.s3p5__mega-suffix'
    });

    // FullStudy F8 / F9 — body-row swipe progress indicator.
    // Each swipe container has a sibling track; toggle data-step on the
    // track based on which card is currently snapped under the start
    // edge of the scroll viewport.
    document.querySelectorAll('.fs-f8__bodyswipe, .fs-f9__bodyswipe').forEach(function (strip) {
        var track = strip.nextElementSibling;
        if (!track) return;
        if (!track.classList.contains('fs-f8__swipe-track') &&
            !track.classList.contains('fs-f9__swipe-track')) return;
        function update() {
            var max = strip.scrollWidth - strip.clientWidth;
            if (max <= 0) return;
            var step = strip.scrollLeft / max > 0.5 ? '1' : '0';
            if (track.getAttribute('data-step') !== step) {
                track.setAttribute('data-step', step);
            }
        }
        strip.addEventListener('scroll', update, { passive: true });
        update();
    });
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
   Section 2 — 3 SVG slider states, smooth crossfade.
   Slider value 0..1 maps onto position 0..2 across the three
   stacked layers; each layer's opacity = max(0, 1 - |pos - idx|),
   so neighbours fade through each other continuously instead of
   snapping at thirds.
   ============================================================ */
(function () {
    var slider = document.getElementById('slider');
    var states = document.querySelectorAll('.section2__state');
    if (!slider || states.length === 0) return;
    var last = states.length - 1;
    function update() {
        var v = parseFloat(slider.value) || 0;
        var pos = v * last; // 0..last across the layers
        for (var k = 0; k < states.length; k++) {
            var op = Math.max(0, 1 - Math.abs(pos - k));
            states[k].style.opacity = op.toFixed(3);
        }
    }
    slider.addEventListener('input', update);
    update();
})();

/* ============================================================
   Article 7 mobile — fluid frame scaling (611c71e article-6 layout).
   Frame is designed at 375px; scale to actual viewport width so
   the design fills the screen on any phone (414, 428, 600, etc.).
   ============================================================ */
(function () {
    var frame = document.querySelector('.article-7-frame');
    if (!frame) return;
    var MOBILE_MAX = 768;
    var DESIGN_W = 375;
    function setScale() {
        if (window.innerWidth <= MOBILE_MAX) {
            document.documentElement.style.setProperty('--article-7-mob-scale', (window.innerWidth / DESIGN_W).toFixed(4));
        } else {
            document.documentElement.style.removeProperty('--article-7-mob-scale');
        }
    }
    setScale();
    window.addEventListener('resize', setScale);
})();

/* ============================================================
   Scroll-driven blur clear — shared for:
     • .article-7-midphoto __img (Samanlyoglu article 7)
     • .art-page--4 .art4-tip--6 .art4-tip__portrait (article 4 portrait)
     • .art-page--5 .art5-body__figure--ghost (article 5 body portrait)
   Blur 40px → 0px as the block moves from first-visible to
   vertical center of viewport ("cover 0%..cover 50%").
   ============================================================ */
(function () {
    function bind(blockSel, imgSel) {
        var block = document.querySelector(blockSel);
        var img = block && block.querySelector(imgSel);
        if (!img) return;
        var MAX_BLUR = 40;
        var ticking = false;
        function compute() {
            ticking = false;
            var rect = block.getBoundingClientRect();
            var vh = window.innerHeight || document.documentElement.clientHeight;
            var scrolled = vh - rect.top;
            var totalScroll = vh + rect.height;
            var coverProgress = scrolled / totalScroll;
            var progress = Math.max(0, Math.min(1, coverProgress / 0.5));
            var blur = MAX_BLUR * (1 - progress);
            img.style.filter = 'blur(' + blur.toFixed(2) + 'px)';
        }
        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(compute);
        }
        compute();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    }
    bind('.article-7-midphoto', '.article-7-midphoto__img');
    bind('.art-page--4 .art4-tip--6 .art4-tip__portrait', '.art4-tip__portrait-photo');
    bind('.art-page--5 .art5-body__figure--ghost', '.art5-body__figure-photo');
})();

/* ============================================================
   Article 7 CTA — scroll-driven 360° rotation of the orbit rings (611c71e).
   Sets --article-7-cta-progress on the CTA element.
   ============================================================ */
(function () {
    var cta = document.querySelector('.article-7-cta');
    if (!cta) return;
    var ticking = false;
    function compute() {
        ticking = false;
        var rect = cta.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        cta.style.setProperty('--article-7-cta-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F2 — scroll-driven 360° rotation of the orbital
   rings (.fs-f2__cta-art). Exact mirror of the section6/phase7
   IIFE above; progress 0..1 is set on the host section as
   --fs-f2-progress so the CSS calc(360deg * progress) picks it up.
   Full revolution lands at the same horizontal orientation as the
   starting frame (so the chromatic strokes don't end up mirrored).
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f2');
    if (!section) return;
    var ticking = false;

    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        section.style.setProperty('--fs-f2-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F2 — scroll-driven divider growth. Anchored on the
   .fs-f2__cta-hint element so the animation starts when the hint
   first appears at the viewport bottom and finishes by the time
   it reaches the viewport vertical centre — both endpoints fall
   within the user's view, so they always see the divider grow.
   Exposed on .fs-f2 as --fs-f2-divider-progress.
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f2');
    var hint = section && section.querySelector('.fs-f2__cta-hint');
    if (!section || !hint) return;
    var ticking = false;

    function compute() {
        ticking = false;
        var rect = hint.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var startTop = vh;            /* hint top crosses viewport bottom */
        var endTop = vh * 0.5;        /* hint top reaches viewport centre */
        var range = startTop - endTop;
        var progress = range > 0
            ? Math.max(0, Math.min(1, (startTop - rect.top) / range))
            : 0;
        section.style.setProperty('--fs-f2-divider-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F10 — scroll-driven growth of the purple rectangle
   (.fs-f10__rect--purple) from "1—3 years" to "1—15 years".
   Anchored on the rect itself so the animation runs while the
   user is actually looking at it: progress 0..1 ramps as the
   rect's top crosses the viewport bottom and reaches the
   viewport vertical centre. Same progress drives:
     - CSS width via --fs-f10-progress
     - text content of .fs-f10__rect-num-upper (3 → 15, rounded)
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f10');
    var rect = section && section.querySelector('.fs-f10__rect--purple');
    var upper = section && section.querySelector('.fs-f10__rect-num-upper');
    if (!section || !rect || !upper) return;

    var fromN = parseFloat(upper.dataset.from || '3');
    var toN   = parseFloat(upper.dataset.to   || '15');
    var ticking = false;

    function compute() {
        ticking = false;
        var r = rect.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        /* Animation kicks in only AFTER the rect's bottom (at its
           baseline height) has fully entered the viewport. We use
           the rect's CURRENT bottom as the gate — at progress 0 the
           rect is still at baseline so this measures the baseline
           bottom; once growing, bottom moves down, but the gating
           condition has already been crossed.                          */
        /* Start later than "just fully visible" so the user has actually
           settled the rect into their field of view before it starts
           animating. Pick the lower of "rect fully visible" and "rect.top
           at 65% of viewport" — for short rects the 65% gate kicks in
           later; for tall rects the fully-visible gate stays. */
        var startTop = Math.min(vh - r.height, vh * 0.65);
        var endTop = vh / 2;            /* rect's top reaches viewport middle —
                                           animation finishes by the time the
                                           user has scrolled the rect halfway
                                           up the screen */
        var range = startTop - endTop;
        var progress = range > 0
            ? Math.max(0, Math.min(1, (startTop - r.top) / range))
            : 0;
        section.style.setProperty('--fs-f10-progress', progress.toFixed(4));
        var n = Math.round(fromN + (toN - fromN) * progress);
        if (upper.textContent !== String(n)) upper.textContent = n;
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F11 — scroll-driven 360° rotation of the orbital
   rings (.fs-f11__rings). Direct mirror of the F2 IIFE above:
   progress 0..1 on .fs-f11 via --fs-f11-progress, picked up by
   the rings' rotate(calc(360deg * progress)) transform.
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f11');
    if (!section) return;
    var ticking = false;

    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        section.style.setProperty('--fs-f11-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F11 — scroll-driven divider growth. Mirrors the F2
   divider IIFE: anchored on the .fs-f11__final block (no
   "cta-hint" exists in F11, so the final "Опыт" block is the
   natural target). Animation starts when the final block's top
   first appears at the viewport bottom and finishes when it
   reaches the viewport vertical centre — both endpoints fall
   within view, so the user always sees the line grow.
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f11');
    var anchor = section && section.querySelector('.fs-f11__final');
    if (!section || !anchor) return;
    var ticking = false;

    function compute() {
        ticking = false;
        var rect = anchor.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var startTop = vh;            /* anchor top crosses viewport bottom */
        var endTop = vh * 0.5;        /* anchor top reaches viewport centre */
        var range = startTop - endTop;
        var progress = range > 0
            ? Math.max(0, Math.min(1, (startTop - rect.top) / range))
            : 0;
        section.style.setProperty('--fs-f11-divider-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F5 — legend swatches act as a toggle: click sets
   data-state on .fs-f5 ("humanitarian" / "technical"), updates
   .is-selected on the swatches and aria-selected. CSS handles
   the chart cell width swap + label position shift via
   transitions.
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f5');
    if (!section) return;
    var swatches = section.querySelectorAll('.fs-f5__legend-swatch[data-state]');
    if (!swatches.length) return;
    function setState(state) {
        section.setAttribute('data-state', state);
        swatches.forEach(function (sw) {
            var on = sw.dataset.state === state;
            sw.classList.toggle('is-selected', on);
            sw.setAttribute('aria-selected', on ? 'true' : 'false');
        });
    }
    swatches.forEach(function (sw) {
        sw.addEventListener('click', function () { setState(sw.dataset.state); });
    });
})();

/* ============================================================
   FullStudy F5 generations toggle — gen-legend swatches drive
   data-state-gen on .fs-f5 ("older" / "younger"), swapping the
   blob graphics + body copy + body color via CSS.
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f5');
    if (!section) return;
    var swatches = section.querySelectorAll('.fs-f5__legend-swatch[data-state-gen]');
    if (!swatches.length) return;
    function setState(state) {
        section.setAttribute('data-state-gen', state);
        swatches.forEach(function (sw) {
            var on = sw.dataset.stateGen === state;
            sw.classList.toggle('is-selected', on);
            sw.setAttribute('aria-selected', on ? 'true' : 'false');
        });
    }
    swatches.forEach(function (sw) {
        sw.addEventListener('click', function () { setState(sw.dataset.stateGen); });
    });
})();

/* ============================================================
   FullStudy F3 — scroll-driven opacity fade for the "фандрайзер"
   word SVG (.fs-f3__words). Goes from opacity 1.0 (when the
   section is just entering the viewport) down to 0.2 (after it
   has fully scrolled past). progress 0..1 set on .fs-f3 as
   --fs-f3-progress; CSS picks it up via calc(1 - 0.8*progress).
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f3');
    if (!section) return;
    var ticking = false;

    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        section.style.setProperty('--fs-f3-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F6 — scroll-driven Venn-converge: as the equation
   block scrolls past, both ellipses (and the words inside them)
   slide horizontally toward the canvas centre until they fully
   overlap into a single unreadable cluster. Progress 0..1 is
   exposed on .fs-f6 as --fs-f6-progress.
   Anchor: progress stays at 0 until the equation block is fully
   in the viewport (so the user actually sees the initial state
   first); ramps to 1 by the time the equation is vertically
   centred in the viewport. Falls back to a generic scroll-through
   range if the equation is taller than the viewport.
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f6');
    if (!section) return;
    var eq = section.querySelector('.fs-f6__equation') || section;
    var ticking = false;

    /* easeInOutCubic — smooths the linear scroll progress into a
       gentle ease-in-out curve.                                       */
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function compute() {
        ticking = false;
        var rect = eq.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        /* Animation starts later (equation already centred-ish in the
           viewport) and runs longer (continues until the equation has
           scrolled noticeably above the viewport top) so the connection
           feels paced rather than snappy. Eased in-out cubic. */
        var startTop = vh * 0.4;
        var endTop = -vh * 0.15;
        if (endTop > startTop) endTop = startTop * 0.3;
        var range = startTop - endTop;
        var raw = 0;
        if (range > 0) {
            raw = Math.max(0, Math.min(1, (startTop - rect.top) / range));
        } else if (rect.top <= startTop) {
            raw = 1;
        }
        var progress = easeInOutCubic(raw);
        section.style.setProperty('--fs-f6-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

/* ============================================================
   FullStudy F7 — scroll-driven rotation of the two polygons
   (.fs-f7__poly--orange and .fs-f7__poly--purple). Both swing
   from their pinned top edge by up to 55°. Progress 0..1 is
   exposed on .fs-f7 as --fs-f7-progress; CSS reads it via
   rotate(calc(±55deg * var(--fs-f7-progress))) per polygon.
   The raw scroll-through fraction is multiplied by 2 and clamped
   so the rotation completes by the time the section centre
   reaches the viewport centre (raw ≈ 0.5).
   ============================================================ */
(function () {
    var section = document.querySelector('.fs-f7');
    if (!section) return;
    var ticking = false;

    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var raw = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        var progress = Math.min(1, raw * 2);
        section.style.setProperty('--fs-f7-progress', progress.toFixed(4));
    }
    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
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
   Phase 8 — Section 8 card pager + mobile carousel. Cards are
   populated from data/exp-cards.json (4 picks, alternating
   event/text to match the Figma event/story/event/story
   layout). After rendering, the desktop pager (lime outline
   between 4 fixed cards) and the mobile dot carousel both
   re-query the freshly-rendered .s8__card elements.
   ============================================================ */
(function () {
    var section = document.querySelector('.section8__phase8');
    if (!section) return;
    var track = section.querySelector('.s8__track');
    if (!track) return;

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* Build the media box for a card based on its exp-card variant — same
       art treatment as on the experience page (mix-blend overlays, dark
       polygons / diagonals, blurred photo + title), just scaled to the
       295×295 s8 thumbnail. */
    function diagonalSvg() {
        return ''
            + '<svg class="s8__media-svg" viewBox="0 0 295 295" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
            +   '<rect width="295" height="295" fill="#272727"/>'
            +   '<path d="M770 40L466 260M373 35L76 257" stroke="#AA6EFF" stroke-width="2"/>'
            +   '<path d="M263 257L-201 112M-47 17L411 163" stroke="#272727" stroke-width="2" style="mix-blend-mode: plus-lighter"/>'
            + '</svg>';
    }

    function renderMedia(c) {
        var variant = c.variant;
        var photo = c.photo, overlay = c.photoOverlay;

        if (variant === 'dark-diagonal') {
            return '<div class="s8__media s8__media--diagonal">' + diagonalSvg() + '</div>';
        }
        if (variant === 'dark-polygons') {
            return '<div class="s8__media s8__media--polygons">'
                +   '<img src="./img/figma/exp_card_polygons.svg" class="s8__media-svg" alt="" />'
                + '</div>';
        }
        if (variant === 'dark-blurred') {
            return '<div class="s8__media s8__media--blurred">'
                + (c.mediaPhoto ? '<img src="' + escapeHtml(c.mediaPhoto) + '" class="s8__media-blurred-photo" alt="" />' : '')
                + (c.mediaTitle ? '<span class="s8__media-blurred-title">' + escapeHtml(c.mediaTitle) + '</span>' : '')
                + '</div>';
        }
        if (variant === 'duotone') {
            return '<div class="s8__media s8__media--duotone">'
                + (photo   ? '<img src="' + escapeHtml(photo)   + '" class="s8__media-base" alt="" />' : '')
                + (overlay ? '<img src="' + escapeHtml(overlay) + '" class="s8__media-overlay" alt="" />' : '')
                + '</div>';
        }
        if (variant === 'photo-only-547') {
            return '<div class="s8__media s8__media--photo-547">'
                + (photo ? '<img src="' + escapeHtml(photo) + '" class="s8__media-face" alt="" />' : '')
                + '</div>';
        }
        if (variant === 'photo-orange') {
            return '<div class="s8__media s8__media--photo-orange">'
                + (photo ? '<img src="' + escapeHtml(photo) + '" class="s8__media-face" alt="" />' : '')
                + '</div>';
        }
        if (variant === 'bordered') {
            // Bordered cards use a flipped layout (pills on top → big
            // heading → tiny portrait + caption at bottom-left). The title
            // is rendered via the card-level .s8__heading (see renderCard),
            // so the media here only carries the inset portrait.
            return '<div class="s8__media s8__media--bordered">'
                + (c.insetPhoto ? '<img src="' + escapeHtml(c.insetPhoto) + '" class="s8__media-inset" alt="" />' : '')
                + '</div>';
        }
        // generic fallback
        var src = photo || c.mediaPhoto || c.insetPhoto || './img/figma/section8_story_photo.png';
        return '<div class="s8__media s8__media--generic">'
            +    '<img src="' + escapeHtml(src) + '" class="s8__media-base" alt="" />'
            + '</div>';
    }

    function renderCard(c, pos) {
        var tag1 = (c.tags && c.tags[0]) || { label: '' };
        var tag2 = (c.tags && c.tags[1]) || { label: '' };
        var isEvent = c.kind === 'event';
        // pos1..pos4 still drive the legacy desktop offsets; for cards beyond
        // the first 4 the track scrolls so pos5+ just keeps a unique class.
        var posClass = 's8__card--pos' + pos;
        var typeClass = isEvent ? 's8__card--event' : 's8__card--story';
        var variantClass = c.variant === 'bordered' ? ' s8__card--bordered' : '';
        var active = pos === 1 ? ' data-active="true"' : '';
        var leftPill  = isEvent ? 's8__pill--event-left'  : 's8__pill--story-left';
        var rightPill = isEvent ? 's8__pill--lime s8__pill--event-right'
                                : 's8__pill--white s8__pill--story-right';
        var connector = isEvent ? 's8__connector--event' : 's8__connector--story';

        // Bordered cards put the title inside the framed media (mirroring
        // the experience-page design) so skip the heading row below to
        // avoid duplicating the same text.
        var heading = c.variant === 'bordered'
            ? ''
            : '<p class="s8__heading">' + escapeHtml(c.title || c.mediaTitle || '') + '</p>';

        var caption = c.caption
            ? '<p class="s8__caption">' + escapeHtml(c.caption).replace(/\n/g, '<br>') + '</p>'
            : '';

        var cardHtml = ''
            + '<article class="s8__card ' + typeClass + ' ' + posClass + variantClass + '"' + active + '>'
            +   renderMedia(c)
            +   '<span class="s8__pill s8__pill--outline ' + leftPill + '"><span class="s8__pill-text">' + escapeHtml(tag1.label) + '</span></span>'
            +   '<span class="s8__connector ' + connector + '" aria-hidden="true"></span>'
            +   '<span class="s8__pill ' + rightPill + '"><span class="s8__pill-text">' + escapeHtml(tag2.label) + '</span></span>'
            +   heading
            +   caption
            + '</article>';
        return c.href
            ? '<a href="' + escapeHtml(c.href) + '" class="s8__card-link">' + cardHtml + '</a>'
            : cardHtml;
    }

    function renderTrack(cards) {
        // Render every card except the xl variant (no title/tags to display).
        var picked = cards.filter(function (c) { return c.variant !== 'xl'; });
        if (!picked.length) return false;
        track.innerHTML = picked.map(function (c, i) {
            return renderCard(c, i + 1);
        }).join('');
        renderDots(picked.length);
        return true;
    }

    /* Generate one mobile carousel dot per card so the indicator count
       always matches the rendered track. */
    function renderDots(count) {
        var container = section.querySelector('.s8__dots');
        if (!container) return;
        var html = '';
        for (var i = 0; i < count; i++) {
            html += '<button type="button" class="s8__dot" data-index="' + i + '"'
                +  (i === 0 ? ' aria-current="true"' : '')
                +  ' aria-label="Карточка ' + (i + 1) + '"></button>';
        }
        container.innerHTML = html;
    }

    /* Desktop pager — clicking prev/next scrolls the track to the previous /
       next card. Prev disabled at start; next disabled when the track is at
       its scroll-right end. */
    function initPager() {
        var prev = section.querySelector('.s8__nav-btn--prev');
        var next = section.querySelector('.s8__nav-btn--next');
        if (!prev || !next) return;
        var cards = track.querySelectorAll('.s8__card');
        if (!cards.length) return;

        function nearestIndex() {
            var x = track.scrollLeft;
            var bestI = 0, bestD = Infinity;
            cards.forEach(function (c, i) {
                var d = Math.abs(c.offsetLeft - x);
                if (d < bestD) { bestD = d; bestI = i; }
            });
            return bestI;
        }
        function maxScrollLeft() {
            return track.scrollWidth - track.clientWidth;
        }
        function updateButtons() {
            prev.disabled = track.scrollLeft <= 1;
            next.disabled = track.scrollLeft >= maxScrollLeft() - 1;
        }
        function scrollToCard(i) {
            var card = cards[Math.max(0, Math.min(cards.length - 1, i))];
            if (!card) return;
            track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
        }

        prev.addEventListener('click', function () { scrollToCard(nearestIndex() - 1); });
        next.addEventListener('click', function () { scrollToCard(nearestIndex() + 1); });
        track.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);
        updateButtons();
    }

    /* Mobile dot carousel — clicking a dot scrolls track to that card;
       scrolling updates the active dot. */
    function initCarousel() {
        var dots = section.querySelectorAll('.s8__dot');
        if (!dots.length) return;
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
    }

    fetch('./data/exp-cards.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!renderTrack(data)) return;
            initPager();
            initCarousel();
        })
        .catch(function (err) {
            // Fall back to the static cards already in the markup.
            console.error('Failed to load exp-cards.json for section8', err);
            initPager();
            initCarousel();
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
    var dotsContainer = section.querySelector('.s9__dots');
    if (!track || !dotsContainer) return;
    var cols = track.querySelectorAll('.s9__col');
    if (!cols.length) return;

    // Generate one dot per column so the indicator count always tracks the
    // actual partner list (same pattern as section 8).
    var html = '';
    for (var i = 0; i < cols.length; i++) {
        html += '<button type="button" class="s9__dot" data-index="' + i + '"'
            +  (i === 0 ? ' aria-current="true"' : '')
            +  ' aria-label="Партнёр ' + (i + 1) + '"></button>';
    }
    dotsContainer.innerHTML = html;
    var dots = section.querySelectorAll('.s9__dot');

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

/* ============================================================
   Share buttons — copy current page URL on click and surface a
   transient "Ссылка скопирована" toast (fade in → hold → fade out).
   Covers fullstudy's two share affordances; safe no-op if the
   page has none of them.
   ============================================================ */
(function () {
    var shareButtons = document.querySelectorAll('.fs-f2__cta-share, .fs-f11__cta-share');
    if (!shareButtons.length) return;

    var toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = 'Ссылка скопирована';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    var hideTimer;

    function positionToast(btn) {
        var rect = btn.getBoundingClientRect();
        toast.style.left = (rect.left + rect.width / 2) + 'px';
        toast.style.top = (rect.bottom + 12) + 'px';
    }

    function showToast(btn) {
        clearTimeout(hideTimer);
        positionToast(btn);
        toast.classList.add('is-visible');
        hideTimer = setTimeout(function () {
            toast.classList.remove('is-visible');
        }, 1600);
    }

    function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
    }

    function copyAndNotify(btn) {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
                .then(function () { showToast(btn); })
                .catch(function () { fallbackCopy(url); showToast(btn); });
        } else {
            fallbackCopy(url);
            showToast(btn);
        }
    }

    shareButtons.forEach(function (btn) {
        btn.addEventListener('click', function () { copyAndNotify(btn); });
    });
})();
