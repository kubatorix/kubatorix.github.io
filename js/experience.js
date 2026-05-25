/* ============================================================
   Experience page — render cards from data/exp-cards.json
   then wire up the segmented filter (texts / all / events).
   ============================================================ */
(function () {
    var grid = document.querySelector('.exp-grid');
    if (!grid) return;

    var mobileQuery = window.matchMedia('(max-width: 770px)');
    var cachedCards = null;

    function isExpMobile() {
        return mobileQuery.matches;
    }

    function cardsForViewport(cards) {
        if (!isExpMobile()) return cards;
        return cards.filter(function (c) { return c.variant !== 'xl'; });
    }

    function linkAttrs(c) {
        if (!c.href) return '';
        return ' data-href="' + c.href + '" onclick="window.location.href=this.getAttribute(\'data-href\')"';
    }

    /* Per-variant template registry. Each template returns an HTML string. */
    var TEMPLATES = {
        bordered: function (c) {
            function br(s) { return (s || '').replace(/\n/g, '<br>'); }
            return ''
                + '<article class="exp-card exp-card--bordered" data-kind="' + c.kind + '"' + linkAttrs(c) + '>'
                + tagsHtml(c.tags)
                + '<h3 class="exp-card__title">' + br(c.title) + '</h3>'
                + (c.insetPhoto
                    ? '<img src="' + c.insetPhoto + '" class="exp-card__photo--inset" alt="" aria-hidden="true" />'
                    : '')
                + (c.caption
                    ? '<p class="exp-card__sub exp-card__sub--inset">' + br(c.caption) + '</p>'
                    : '')
                + '</article>';
        },

        duotone: function (c) {
            var fullClass = c.photoLayout === 'full' ? ' exp-card--photo-duotone-full' : '';
            var mediaHtml = c.photoLayout === 'full'
                ? '<img src="' + c.photo + '" class="exp-card__photo exp-card__photo--single" alt="" aria-hidden="true" />'
                : '<img src="' + c.photo + '" class="exp-card__photo" alt="" aria-hidden="true" />'
                    + '<img src="' + c.photoOverlay + '" class="exp-card__photo--duotone" alt="" aria-hidden="true" />';
            return ''
                + '<article class="exp-card exp-card--photo' + fullClass + '" data-kind="' + c.kind + '"' + linkAttrs(c) + '>'
                + '<div class="exp-card__media">'
                +   mediaHtml
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'photo-only-547': function (c) {
            var fullClass = c.photoLayout === 'full' ? ' exp-card--photo-full' : '';
            return ''
                + '<article class="exp-card exp-card--photo exp-card--photo-only-547' + fullClass + '" data-kind="' + c.kind + '"' + linkAttrs(c) + '>'
                + '<div class="exp-card__media">'
                +   '<img src="' + c.photo + '" class="exp-card__photo--duotone" alt="" aria-hidden="true" />'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'photo-orange': function (c) {
            return ''
                + '<article class="exp-card exp-card--photo exp-card--photo-orange" data-kind="' + c.kind + '"' + linkAttrs(c) + '>'
                + '<div class="exp-card__media">'
                +   '<img src="' + c.photo + '" class="exp-card__photo--duotone" alt="" aria-hidden="true" />'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        xl: function (c) {
            var videoSrc = c.video || './video/fandraizer_web.mp4';
            return ''
                + '<article class="exp-card exp-card--xl" data-kind="' + c.kind + '">'
                // + '<img src="' + (c.photo || './img/figma/exp_card_b_image546.png') + '" class="exp-card__photo" alt="" aria-hidden="true" />'
                // + '<img src="' + (c.photoOverlay || './img/figma/exp_card_b_image547.png') + '" class="exp-card__photo exp-card__photo--duotone" alt="" aria-hidden="true" />'
                +   '<video class="exp-card__video" src="' + videoSrc + '" autoplay loop muted defaultMuted playsinline disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" aria-hidden="true"></video>'
                + '</article>';
        },

        'dark-diagonal': function (c) {
            var media = c.mediaPhoto
                ? '<img src="' + c.mediaPhoto + '" class="exp-card__diagonal-photo" alt="" aria-hidden="true" />'
                : diagonalSvg();
            return ''
                + '<article class="exp-card exp-card--dark" data-kind="' + c.kind + '"' + linkAttrs(c) + '>'
                + '<div class="exp-card__media">'
                +   media
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'dark-polygons': function (c) {
            var polygonsSrc = c.mediaPhoto || './img/figma/exp_card_polygons.svg';
            return ''
                + '<article class="exp-card exp-card--polygons" data-kind="' + c.kind + '"' + linkAttrs(c) + '>'
                + '<div class="exp-card__media">'
                +   '<img src="' + polygonsSrc + '" class="exp-card__polygons" alt="" aria-hidden="true" />'
                + '</div>'
                + overlayHtml(c)
                + '</article>';
        },

        'dark-blurred': function (c) {
            var full = c.photoLayout === 'full';
            var fullClass = full ? ' exp-card--blurred-full' : '';
            var photoClass = 'exp-card__photo--blurred' + (full ? ' exp-card__photo--full' : '');
            var titleHtml = (!full && c.mediaTitle)
                ? '<h3 class="exp-card__media-title">' + c.mediaTitle + '</h3>'
                : '';
            return ''
                + '<article class="exp-card exp-card--blurred' + fullClass + '" data-kind="' + c.kind + '"' + linkAttrs(c) + '>'
                + '<div class="exp-card__media">'
                +   '<img src="' + c.mediaPhoto + '" class="' + photoClass + '" alt="" aria-hidden="true" />'
                +   titleHtml
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

    function muteCardVideos(root) {
        (root || document).querySelectorAll('.exp-card__video').forEach(function (v) {
            v.muted = true;
            v.defaultMuted = true;
            v.volume = 0;
            v.removeAttribute('controls');
        });
    }

    var toggleCtrl = null;

    function render(cards) {
        cachedCards = cards;
        grid.innerHTML = cardsForViewport(cards).map(function (c) {
            var tpl = TEMPLATES[c.variant];
            return tpl ? tpl(c) : '';
        }).join('');
        muteCardVideos(grid);
        if (toggleCtrl) {
            toggleCtrl.refreshCards();
            toggleCtrl.applyVisibility();
        } else {
            initToggle();
        }
    }

    function initToggle() {
        var toggle = document.querySelector('.exp-toggle');
        var loadMoreBtn = document.querySelector('.exp-loadmore');
        var loadMoreLabel = loadMoreBtn && loadMoreBtn.querySelector('.exp-loadmore__label');
        if (!toggle) return;

        var pageSize = 3;
        var visibleCount = pageSize;
        var currentState = 'all';

        function cards() {
            return document.querySelectorAll('.exp-card[data-kind]');
        }

        function getMatchedCards() {
            var matched = [];
            cards().forEach(function (card) {
                var kind = card.getAttribute('data-kind');
                var match =
                    currentState === 'all' ||
                    (currentState === 'texts' && kind === 'text') ||
                    (currentState === 'events' && kind === 'event');
                if (match) matched.push(card);
            });
            return matched;
        }

        function applyVisibility() {
            var list = cards();
            if (!list.length) return;

            var matched = getMatchedCards();
            list.forEach(function (card) {
                card.hidden = matched.indexOf(card) === -1;
            });

            // On mobile, reveal matched cards in batches of 3.
            if (mobileQuery.matches) {
                matched.forEach(function (card, i) {
                    if (i >= visibleCount) card.hidden = true;
                });
            }

            updateLoadMore(matched.length);
        }

        function updateLoadMore(matchedCount) {
            if (!loadMoreBtn) return;
            var needsButton = mobileQuery.matches && matchedCount > pageSize;
            loadMoreBtn.hidden = !needsButton;
            if (!needsButton) return;
            var allVisible = visibleCount >= matchedCount;
            loadMoreBtn.dataset.state = allVisible ? 'expanded' : 'collapsed';
            if (loadMoreLabel) {
                loadMoreLabel.innerHTML = allVisible
                    ? 'Свернуть'
                    : 'Это&nbsp;не&nbsp;всё.<br>Загрузить ещё';
            }
        }

        function setState(state) {
            currentState = state;
            toggle.setAttribute('data-state', state);
            toggle.querySelectorAll('.exp-toggle__seg').forEach(function (seg) {
                seg.setAttribute(
                    'aria-selected',
                    seg.dataset.action === state ? 'true' : 'false'
                );
            });
            visibleCount = pageSize;
            applyVisibility();
        }

        toggle.querySelectorAll('.exp-toggle__seg[data-action]').forEach(function (seg) {
            seg.addEventListener('click', function () {
                setState(seg.dataset.action);
            });
        });

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                var matchedCount = getMatchedCards().length;
                if (visibleCount >= matchedCount) {
                    visibleCount = pageSize;
                } else {
                    visibleCount = Math.min(visibleCount + pageSize, matchedCount);
                }
                applyVisibility();
            });
        }

        mobileQuery.addEventListener('change', applyVisibility);

        toggleCtrl = {
            refreshCards: function () { /* cards() is live each call */ },
            applyVisibility: applyVisibility
        };

        setState('all');
    }

    mobileQuery.addEventListener('change', function () {
        if (cachedCards) render(cachedCards);
    });

    fetch('./data/exp-cards.json')
        .then(function (r) { return r.json(); })
        .then(function (cards) {
            render(cards.filter(function (c) { return !c.hidden; }));
        })
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

/* ============================================================
   Experience — backstage photo slider (exp-backstage)
   ============================================================ */
(function () {
    var section = document.querySelector('.exp-backstage');
    if (!section) return;

    var photos = section.querySelectorAll('.exp-backstage__photo');
    var overlay = section.querySelector('.exp-backstage__overlay');
    var prevBtn = section.querySelector('.exp-backstage__nav-btn--prev');
    var nextBtn = section.querySelector('.exp-backstage__nav-btn--next');
    if (!photos.length || !prevBtn || !nextBtn) return;

    var index = 0;
    var total = photos.length;

    function setCaption(i) {
        if (!overlay) return;
        var caption = photos[i].getAttribute('data-caption') || '';
        overlay.textContent = caption;
    }

    function show(next) {
        index = (next + total) % total;
        for (var i = 0; i < total; i++) {
            photos[i].classList.toggle('is-active', i === index);
        }
        setCaption(index);
    }

    setCaption(0);

    prevBtn.addEventListener('click', function () {
        show(index - 1);
    });
    nextBtn.addEventListener('click', function () {
        show(index + 1);
    });
})();
