(function () {
    const root = document.documentElement;
    const topBar = document.querySelector('.top-bar');
    const navLinks = document.querySelectorAll('.top-nav a, .mobile-nav a');
    const sections = document.querySelectorAll('section[id]');
    const themeBtn = document.getElementById('themeToggle');
    const menuBtn = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const backTop = document.getElementById('backTop');
    const copyEmailBtn = document.getElementById('copyEmail');
    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
    }

    function updateThemeIcon() {
        if (!themeBtn) return;
        const isLight = root.getAttribute('data-theme') === 'light';
        themeBtn.querySelector('i').className = isLight ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        themeBtn.setAttribute('aria-label', isLight ? 'Toggle dark mode' : 'Toggle light mode');
    }

    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') root.setAttribute('data-theme', 'light');
    updateThemeIcon();

    themeBtn?.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        if (isLight) {
            root.removeAttribute('data-theme');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('portfolio-theme', 'light');
        }
        updateThemeIcon();
    });

    menuBtn?.addEventListener('click', () => {
        const open = mobileNav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open);
        menuBtn.querySelector('i').className = open ? 'bi bi-x-lg' : 'bi bi-list';
    });

    mobileNav?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.querySelector('i').className = 'bi bi-list';
        });
    });

    copyEmailBtn?.addEventListener('click', async () => {
        const email = copyEmailBtn.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied to clipboard!');
        } catch {
            showToast('Copy failed — use the email link instead.');
        }
    });

    function onScroll() {
        const y = window.scrollY;
        topBar?.classList.toggle('scrolled', y > 24);
        backTop?.classList.toggle('visible', y > 420);

        let current = '';
        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            let current = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const tick = () => {
                current += step;
                if (current >= target) {
                    el.textContent = target + suffix;
                    return;
                }
                el.textContent = current + suffix;
                requestAnimationFrame(tick);
            };
            tick();
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.6 });

    counters.forEach((c) => counterObserver.observe(c));

    const bars = document.querySelectorAll('.skill-bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    bars.forEach((bar) => barObserver.observe(bar));

    const phrases = ['Web Development', 'Data Analytics', 'AI-Assisted Coding', 'Power BI Dashboards'];
    const typedEl = document.getElementById('typedText');
    if (typedEl) {
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeLoop() {
            const current = phrases[phraseIndex];
            typedEl.textContent = current.substring(0, charIndex);

            if (!deleting && charIndex === current.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }

            if (deleting && charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            charIndex += deleting ? -1 : 1;
            setTimeout(typeLoop, deleting ? 45 : 85);
        }

        typeLoop();
    }
})();
