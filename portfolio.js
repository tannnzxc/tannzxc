(function () {
    const root = document.documentElement;
    const topBar = document.querySelector('.top-bar');
    const navLinks = document.querySelectorAll('[data-nav]');
    const pageViews = document.querySelectorAll('.page-view');
    const themeBtn = document.getElementById('themeToggle');
    const menuBtn = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const backTop = document.getElementById('backTop');
    const copyEmailBtn = document.getElementById('copyEmail');
    const toast = document.getElementById('toast');
    const pageLoader = document.getElementById('pageLoader');

    const pageTitles = {
        about: 'About Me',
        ai: 'Learning AI',
        academic: 'Projects',
        skills: 'Technical Skills',
        resume: 'Resume',
        contact: 'Contact'
    };

    let currentPage = 'about';
    let countersStarted = false;

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

    function closeMobileNav() {
        mobileNav?.classList.remove('open');
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.querySelector('i').className = 'bi bi-list';
        }
    }

    copyEmailBtn?.addEventListener('click', async () => {
        const email = copyEmailBtn.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied to clipboard!');
        } catch {
            showToast('Copy failed — use the email link instead.');
        }
    });

    function setActiveNav(page) {
        navLinks.forEach((link) => {
            const target = link.getAttribute('data-nav') || link.getAttribute('href')?.slice(1);
            link.classList.toggle('active', target === page);
        });
    }

    function animateCounters() {
        if (countersStarted) return;
        const counters = document.querySelectorAll('#page-about [data-count]');
        if (!counters.length) return;
        countersStarted = true;

        counters.forEach((el) => {
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
        });
    }

    function animateSkillBars() {
        document.querySelectorAll('#page-skills .skill-bar-fill').forEach((bar) => {
            bar.style.width = '0';
            requestAnimationFrame(() => {
                bar.style.width = bar.dataset.width;
            });
        });
    }

    function animateCertBars() {
        document.querySelectorAll('#page-resume .cert-progress-fill').forEach((bar) => {
            bar.style.width = '0';
            requestAnimationFrame(() => {
                bar.style.width = bar.dataset.certWidth;
            });
        });
    }

    function animateTerminal() {
        const outputs = document.querySelectorAll('#page-about [data-terminal-out]');
        if (!outputs.length) return;
        outputs.forEach((el) => el.classList.remove('terminal-visible'));
        outputs.forEach((el, i) => {
            setTimeout(() => el.classList.add('terminal-visible'), 280 + i * 220);
        });
    }

    function showPage(page, pushState = true) {
        const validPages = ['about', 'ai', 'academic', 'skills', 'resume', 'contact'];
        if (!validPages.includes(page)) page = 'about';

        if (page === currentPage) return;

        pageLoader?.classList.add('active');

        pageViews.forEach((view) => {
            const isTarget = view.dataset.page === page;
            view.classList.toggle('active', isTarget);
            view.classList.toggle('leaving', view.dataset.page === currentPage && !isTarget);
        });

        currentPage = page;
        setActiveNav(page);
        document.title = `${pageTitles[page]} | Tristan P. Fornoles`;

        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileNav();

        setTimeout(() => {
            pageViews.forEach((view) => view.classList.remove('leaving'));
            pageLoader?.classList.remove('active');

            if (page === 'about') {
                animateCounters();
                animateTerminal();
            }
            if (page === 'skills') animateSkillBars();
            if (page === 'resume') animateCertBars();
        }, 320);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const page = link.getAttribute('data-nav') || link.getAttribute('href')?.slice(1);
            if (!page || link.target === '_blank') return;
            e.preventDefault();
            showPage(page);
        });
    });

    window.addEventListener('popstate', (e) => {
        const page = e.state?.page || location.hash.slice(1) || 'about';
        showPage(page, false);
    });

    function onScroll() {
        const y = window.scrollY;
        topBar?.classList.toggle('scrolled', y > 24);
        backTop?.classList.toggle('visible', y > 320);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const initialPage = location.hash.slice(1) || 'about';
    if (initialPage !== 'about') {
        pageViews.forEach((view) => {
            view.classList.toggle('active', view.dataset.page === initialPage);
        });
        currentPage = '';
        showPage(initialPage, false);
    } else {
        setActiveNav('about');
        animateCounters();
        animateTerminal();
    }

    const phrases = ['Web Development', 'Data Analytics', 'Learning AI Tools', 'Power BI Dashboards'];
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
