/* Article page — portrait crossfade driven by viewport position
   (same progress formula as .section6 / --section6-progress). */
(function () {
    var portraits = document.querySelectorAll(
        '.art-portrait, .art2-tip__portrait--scroll, .art3-hero__portrait--scroll, .art4-hero__portrait--scroll'
    );
    if (!portraits.length) return;

    var ticking = false;

    function setOpacity(portrait, o1, o2, o3) {
        portrait.style.setProperty('--art-portrait-o1', o1.toFixed(4));
        portrait.style.setProperty('--art-portrait-o2', o2.toFixed(4));
        if (o3 !== undefined) {
            portrait.style.setProperty('--art-portrait-o3', o3.toFixed(4));
        }
    }

    function compute() {
        ticking = false;
        var vh = window.innerHeight || document.documentElement.clientHeight;

        portraits.forEach(function (portrait) {
            var block = portrait.closest('.art2-tip, .art4-tip') || portrait;
            var rect = block.getBoundingClientRect();
            var progress = Math.max(
                0,
                Math.min(1, (vh - rect.top) / (vh + rect.height))
            );

            portrait.style.setProperty('--art-portrait-progress', progress.toFixed(4));

            var layers = portrait.dataset.portraitLayers;
            var o1 = 0;
            var o2 = 0;
            var o3 = 0;

            if (layers === '2') {
                o1 = 1 - progress;
                o2 = progress;
                setOpacity(portrait, o1, o2);
            } else if (layers === '3-swap' || layers === '3-linear') {
                if (progress < 0.3) {
                    o1 = 1;
                } else if (progress < 0.6) {
                    o2 = 1;
                } else {
                    o3 = 1;
                }
                setOpacity(portrait, o1, o2, o3);
            } else if (progress < 0.25) {
                o1 = 1 - progress * 4;
                o2 = progress * 4;
                setOpacity(portrait, o1, o2, o3);
            } else if (progress < 0.5) {
                o2 = 1 - (progress - 0.25) * 4;
                o3 = (progress - 0.25) * 4;
                setOpacity(portrait, o1, o2, o3);
            } else if (progress < 0.75) {
                o3 = 1 - (progress - 0.5) * 4;
                o1 = (progress - 0.5) * 4;
                setOpacity(portrait, o1, o2, o3);
            } else {
                o1 = 1;
                setOpacity(portrait, o1, o2, o3);
            }
        });
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

/* CTA rings — scroll-driven 360° rotation (mirrors section6 / fs-f2). */
(function () {
    var section = document.querySelector('.art-cta');
    if (!section) return;

    var ticking = false;

    function compute() {
        ticking = false;
        var rect = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        section.style.setProperty('--art-cta-progress', progress.toFixed(4));
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
