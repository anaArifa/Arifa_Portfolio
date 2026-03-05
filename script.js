const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const themeBtn = document.querySelector('.theme-btn');
const siteHeader = document.querySelector('.site-header');
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const skillTabs = document.querySelectorAll('.skills-tab');
const skillTiles = document.querySelectorAll('.skill-tile');
const skillLogoImages = document.querySelectorAll('.skill-logo-img');
const typingRole = document.querySelector('.typing-role');
const homeSocialImages = document.querySelectorAll('.home-socials img');

const THEME_KEY = 'portfolio-theme';

const setTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-theme', isLight);

    if (themeBtn) {
        themeBtn.textContent = isLight ? '🌞' : '🌙';
        themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        themeBtn.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
};

const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === 'light' ? 'light' : 'dark');

if (year) {
    year.textContent = new Date().getFullYear();
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem(THEME_KEY, nextTheme);
    });
}

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    const setActiveNavLink = (targetId) => {
        navSectionLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${targetId}`;
            link.classList.toggle('active', isActive);
        });
    };

    const getHeaderOffset = () => {
        return (siteHeader?.offsetHeight || 0) + 12;
    };

    const updateHeaderOffsetVar = () => {
        const headerHeight = siteHeader?.offsetHeight || 68;
        document.documentElement.style.setProperty('--header-offset', `${headerHeight}px`);
    };

    const scrollToSection = (sectionId) => {
        const target = document.getElementById(sectionId);
        if (!target) {
            return;
        }

        const y = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    navSectionLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetHash = link.getAttribute('href');
            if (!targetHash || !targetHash.startsWith('#')) {
                return;
            }

            const targetId = targetHash.slice(1);
            const targetSection = document.getElementById(targetId);
            if (!targetSection) {
                return;
            }

            event.preventDefault();
            setActiveNavLink(targetId);
            navLinks.classList.remove('open');
            scrollToSection(targetId);
            history.replaceState(null, '', `#${targetId}`);
        });
    });

    const observedSections = Array.from(navSectionLinks)
        .map((link) => link.getAttribute('href')?.slice(1) || '')
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const updateActiveFromScroll = () => {
        const currentY = window.scrollY + getHeaderOffset() + 2;
        let currentSectionId = observedSections[0]?.id;

        observedSections.forEach((section) => {
            if (section.offsetTop <= currentY) {
                currentSectionId = section.id;
            }
        });

        if (currentSectionId) {
            setActiveNavLink(currentSectionId);
        }
    };

    const createObserver = () => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries.filter((entry) => entry.isIntersecting);
                if (!visibleEntries.length) {
                    return;
                }

                const topEntry = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (topEntry?.target?.id) {
                    setActiveNavLink(topEntry.target.id);
                }
            },
            {
                root: null,
                rootMargin: `-${getHeaderOffset()}px 0px -55% 0px`,
                threshold: [0.2, 0.4, 0.6],
            }
        );

        observedSections.forEach((section) => observer.observe(section));
        return observer;
    };

    updateHeaderOffsetVar();
    let sectionObserver = createObserver();
    updateActiveFromScroll();

    window.addEventListener('resize', () => {
        updateHeaderOffsetVar();
        sectionObserver.disconnect();
        sectionObserver = createObserver();
        updateActiveFromScroll();
    });

    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });

    const initialHash = window.location.hash.slice(1);
    if (initialHash && document.getElementById(initialHash)) {
        setTimeout(() => {
            scrollToSection(initialHash);
            setActiveNavLink(initialHash);
        }, 0);
    }
}

if (skillTabs.length && skillTiles.length) {
    const setActiveCategory = (category) => {
        skillTabs.forEach((tab) => {
            const isActive = tab.dataset.category === category;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        skillTiles.forEach((tile) => {
            const matches = tile.dataset.category === category;
            tile.classList.toggle('hidden', !matches);
        });
    };

    skillTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            setActiveCategory(tab.dataset.category);
        });
    });
}

if (skillLogoImages.length) {
    const createFallbackText = (altText) => {
        const cleaned = (altText || 'Skill').replace(/\s*logo\s*/i, '').trim();
        if (!cleaned) {
            return 'SKILL';
        }

        const words = cleaned.split(/\s+/);
        if (words.length === 1) {
            return words[0].slice(0, 4).toUpperCase();
        }

        return words.map((word) => word[0]).join('').slice(0, 4).toUpperCase();
    };

    const showLogoFallback = (img) => {
        if (img.dataset.fallbackApplied === 'true') {
            return;
        }

        const parent = img.parentElement;
        if (!parent) {
            return;
        }

        const fallback = document.createElement('span');
        fallback.className = 'skill-fallback';
        fallback.textContent = createFallbackText(img.alt);
        parent.appendChild(fallback);

        img.style.display = 'none';
        img.dataset.fallbackApplied = 'true';
    };

    skillLogoImages.forEach((img) => {
        img.addEventListener('error', () => {
            showLogoFallback(img);
        });

        if (img.complete && img.naturalWidth === 0) {
            showLogoFallback(img);
        }
    });
}

if (typingRole) {
    const roles = ['Web Developer', 'Cybersecurity Learner', 'CSE Undergraduate'];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeFrame = () => {
        const currentRole = roles[roleIndex];
        const visibleText = currentRole.slice(0, charIndex);
        typingRole.textContent = visibleText || '\u00a0';

        if (!deleting && charIndex < currentRole.length) {
            charIndex += 1;
            setTimeout(typeFrame, 85);
            return;
        }

        if (!deleting && charIndex === currentRole.length) {
            deleting = true;
            setTimeout(typeFrame, 1200);
            return;
        }

        if (deleting && charIndex > 0) {
            charIndex -= 1;
            setTimeout(typeFrame, 45);
            return;
        }

        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeFrame, 250);
    };

    typeFrame();
}

if (homeSocialImages.length) {
    const addSocialFallback = (img) => {
        if (img.dataset.fallbackApplied === 'true') {
            return;
        }

        const parent = img.parentElement;
        if (!parent) {
            return;
        }

        const label = (img.alt || 'S').trim();
        const fallback = document.createElement('span');
        fallback.className = 'home-social-fallback';
        fallback.textContent = label.slice(0, 2).toUpperCase();
        parent.appendChild(fallback);

        img.style.display = 'none';
        img.dataset.fallbackApplied = 'true';
    };

    homeSocialImages.forEach((img) => {
        img.addEventListener('error', () => {
            addSocialFallback(img);
        });

        if (img.complete && img.naturalWidth === 0) {
            addSocialFallback(img);
        }
    });
}
