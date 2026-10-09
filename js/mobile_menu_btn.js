document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-item a');
    const focusableElements = [...navLinks, menuToggle];
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function closeMenu() {
        nav.classList.remove('mobile-nav');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const langSelector = document.getElementById('lang-selector');
        if (langSelector) langSelector.classList.remove('nav-open');
    }

    function toggleMenu() {
        const isOpening = !nav.classList.contains('mobile-nav');
        if (isOpening) {
            nav.classList.add('mobile-nav');
            menuToggle.classList.add('is-active');
            menuToggle.setAttribute('aria-expanded', 'true');
            const langSelector = document.getElementById('lang-selector');
            if (langSelector) {
                langSelector.classList.remove('is-open');
                langSelector.classList.add('nav-open');
                const langBtn = document.getElementById('lang-btn');
                if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
            }
        } else {
            closeMenu();
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    menuToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            toggleMenu();
        }
    });
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 950) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!nav.classList.contains('mobile-nav')) return;

        if (e.key === 'Escape') {
            closeMenu();
            menuToggle.focus();
            return;
        }

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
});