/* ============================================================
   Experience page — render cards from data/exp-cards.json
   then wire up the segmented filter (texts / all / events).
   ============================================================ */
(function () {
    var grid = document.querySelector('.exp-grid');
    if (!grid) return;

    /* Per-variant template registry. Each template returns an HTML string. */
    var TEMPLATES = {
        bordered: function (c) {
            return ''
                + '<article class="exp-card exp-card--bordered" data-kind="' + c.kind + '">'
                + tagsHtml(c.tags)
                + '<h3 class="exp-card__title">' + c.title + '</h3>'
                + (c.insetPhoto
                    ? '<img src="' + c.insetPhoto + '" class="exp-card__photo--inset" alt="" aria-hidden="true" />'
                    : '')
                + (c.caption
                    ? '<p class="exp-card__sub exp-card__sub--inset" style="position:absolute;left:110px;bottom:28px;max-width:260px;">' + c.caption + '</p>'
                    : '')
                + '</article>';
        },

        duotone: function (c) {
            return ''
                + '<article class="exp-card exp-card--photo" data-kind="' + c.kind + '">'
                + '<div class="exp-card__media">'
                +   '<img src="' + c.photo + '" class="exp-card__photo" alt="" aria-hidden="true" />'
                +   '<img src="' + c.photoOverlay + '" class="exp-card__photo--duotone" alt="" aria-hidden="true" />'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'photo-only-547': function (c) {
            return ''
                + '<article class="exp-card exp-card--photo exp-card--photo-only-547" data-kind="' + c.kind + '">'
                + '<div class="exp-card__media">'
                +   '<img src="' + c.photo + '" class="exp-card__photo--duotone" alt="" aria-hidden="true" />'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'photo-orange': function (c) {
            return ''
                + '<article class="exp-card exp-card--photo exp-card--photo-orange" data-kind="' + c.kind + '">'
                + '<div class="exp-card__media">'
                +   '<img src="' + c.photo + '" class="exp-card__photo--duotone" alt="" aria-hidden="true" />'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        xl: function (c) {
            return ''
                + '<article class="exp-card exp-card--xl" data-kind="' + c.kind + '">'
                +   '<img src="' + c.photo + '" class="exp-card__photo" alt="" aria-hidden="true" />'
                +   '<img src="' + c.photoOverlay + '" class="exp-card__photo exp-card__photo--duotone" alt="" aria-hidden="true" />'
                + '</article>';
        },

        'dark-diagonal': function (c) {
            return ''
                + '<article class="exp-card exp-card--dark" data-kind="' + c.kind + '">'
                + '<div class="exp-card__media">'
                +   diagonalSvg()
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'dark-polygons': function (c) {
            return ''
                + '<article class="exp-card exp-card--polygons" data-kind="' + c.kind + '">'
                + '<div class="exp-card__media">'
                +   '<img src="./img/figma/exp_card_polygons.svg" class="exp-card__polygons" alt="" aria-hidden="true" />'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'dark-blurred': function (c) {
            return ''
                + '<article class="exp-card exp-card--blurred" data-kind="' + c.kind + '">'
                + '<div class="exp-card__media">'
                +   '<img src="' + c.mediaPhoto + '" class="exp-card__photo--blurred" alt="" aria-hidden="true" />'
                +   '<h3 class="exp-card__media-title">' + (c.mediaTitle || '') + '</h3>'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        }
    };

    function tagsHtml(tags) {
        if (!tags || !tags.length) return '';
        var html = '<div class="exp-card__tags">';
        for (var i = 0; i < tags.length; i++) {
            var t = tags[i];
            var cls = 'exp-tag';
            if (t.type === 'ghost') cls += ' exp-tag--ghost';
            if (t.type === 'lime') cls += ' exp-tag--lime';
            html += '<span class="' + cls + '">' + t.label + '</span>';
            if (i < tags.length - 1) {
                html += '<span class="exp-tag-divider" aria-hidden="true"></span>';
            }
        }
        html += '</div>';
        return html;
    }

    function overlayHtml(c) {
        return ''
            + '<div class="exp-card__overlay">'
            + tagsHtml(c.tags)
            + (c.title ? '<h3 class="exp-card__title exp-card__title--mid">' + c.title + '</h3>' : '')
            + (c.caption ? '<p class="exp-card__sub">' + c.caption + '</p>' : '')
            + '</div>';
    }

    function diagonalSvg() {
        return ''
            + '<svg class="exp-card__diagonal" width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
            +   '<g clip-path="url(#exp_clip_diag_' + Math.random().toString(36).slice(2, 8) + ')">'
            +     '<rect width="399.984" height="399.984" fill="#272727"/>'
            +     '<path d="M1044.57 53.8438L632.356 351.463M505.829 47.1502L103.062 346.95" stroke="#AA6EFF" stroke-width="3"/>'
            +     '<path d="M356.447 347.488L-274 151.641M-64.9501 22.6406L556.05 220.669" stroke="#272727" stroke-width="3" style="mix-blend-mode: plus-lighter"/>'
            +   '</g>'
            + '</svg>';
    }

    function render(cards) {
        grid.innerHTML = cards.map(function (c) {
            var tpl = TEMPLATES[c.variant];
            return tpl ? tpl(c) : '';
        }).join('');
        initToggle();
    }

    function initToggle() {
        var toggle = document.querySelector('.exp-toggle');
        var cards = document.querySelectorAll('.exp-card[data-kind]');
        if (!toggle || !cards.length) return;

        function setState(state) {
            toggle.setAttribute('data-state', state);
            toggle.querySelectorAll('.exp-toggle__seg').forEach(function (seg) {
                seg.setAttribute(
                    'aria-selected',
                    seg.dataset.action === state ? 'true' : 'false'
                );
            });
            cards.forEach(function (card) {
                var kind = card.getAttribute('data-kind');
                var match =
                    state === 'all' ||
                    (state === 'texts' && kind === 'text') ||
                    (state === 'events' && kind === 'event');
                card.hidden = !match;
            });
        }

        toggle.querySelectorAll('.exp-toggle__seg[data-action]').forEach(function (seg) {
            seg.addEventListener('click', function () {
                setState(seg.dataset.action);
            });
        });

        setState('all');
    }

    fetch('./data/exp-cards.json')
        .then(function (r) { return r.json(); })
        .then(render)
        .catch(function (err) {
            console.error('Failed to load exp-cards.json', err);
        });
})();


/* exp-discuss vertical divider — height grows as the section enters viewport.
   Mirrors fs-f11__cta-divider scroll behavior. */
(function () {
    var section = document.querySelector('.exp-discuss');
    if (!section) return;
    var ticking = false;

    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var startTop = vh;
        var endTop = vh * 0.5;
        var range = startTop - endTop;
        var progress = range > 0
            ? Math.max(0, Math.min(1, (startTop - rect.top) / range))
            : 0;
        section.style.setProperty('--exp-discuss-divider-progress', progress.toFixed(4));
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
