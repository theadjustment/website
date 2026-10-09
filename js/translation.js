const flagSVGs = {
    el: `<svg class="flag-svg" viewBox="0 0 640 480" width="20" height="15" aria-hidden="true">
        <path fill="#0d5eaf" fill-rule="evenodd" d="M0 0h640v53.3H0z"/>
        <path fill="#fff" fill-rule="evenodd" d="M0 53.3h640v53.4H0z"/>
        <path fill="#0d5eaf" fill-rule="evenodd" d="M0 106.7h640V160H0z"/>
        <path fill="#fff" fill-rule="evenodd" d="M0 160h640v53.3H0z"/>
        <path fill="#0d5eaf" d="M0 0h266.7v266.7H0z"/>
        <path fill="#0d5eaf" fill-rule="evenodd" d="M0 213.3h640v53.4H0z"/>
        <path fill="#fff" fill-rule="evenodd" d="M0 266.7h640V320H0z"/>
        <path fill="#0d5eaf" fill-rule="evenodd" d="M0 320h640v53.3H0z"/>
        <path fill="#fff" fill-rule="evenodd" d="M0 373.3h640v53.4H0z"/>
        <g fill="#fff" fill-rule="evenodd" stroke-width="1.3">
            <path d="M106.7 0H160v266.7h-53.3z"/>
            <path d="M0 106.7h266.7V160H0z"/>
        </g>
        <path fill="#0d5eaf" d="M0 426.7h640V480H0z"/>
    </svg>`,
    en: `<svg class="flag-svg" viewBox="0 0 640 480" width="20" height="15" aria-hidden="true">
        <path fill="#012169" d="M0 0h640v480H0z"/>
        <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"/>
        <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
        <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
        <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
    </svg>`
};

const langNames = {
    el: "Ελληνικά",
    en: "English"
};

const translationCache = {};
const translationPromises = {};

const initialPreferredLanguage = (function () {
    try {
        return localStorage.getItem('tap_preferred_language') || 'el';
    } catch (e) {
        return 'el';
    }
})();
fetchTranslations(initialPreferredLanguage);

async function fetchTranslations(lang) {
    if (translationCache[lang]) {
        return translationCache[lang];
    }
    if (translationPromises[lang]) {
        return translationPromises[lang];
    }

    translationPromises[lang] = (async () => {
        try {
            const response = await fetch(`./languages/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translation file (${response.status} ${response.statusText})`);
            }
            const data = await response.json();
            translationCache[lang] = data;
            return data;
        } catch (error) {
            console.error(`[i18n] Error loading translation file for "${lang}":`, error);
            if (window.location.protocol === 'file:') {
                console.warn('[i18n] Note: Browsers block fetch requests on local file:// URLs due to CORS security. Serve the project using a local web server (e.g. Live Server, npx serve, or python -m http.server).');
            }
            return null;
        } finally {
            delete translationPromises[lang];
        }
    })();

    return translationPromises[lang];
}

function initLanguageSwitcher() {
    const langSelector = document.getElementById('lang-selector');
    const langBtn = document.getElementById('lang-btn');
    const currentFlagIcon = document.getElementById('current-flag-icon');
    const currentLangText = document.getElementById('current-lang-text');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentBadge = document.getElementById('current-lang-badge');

    if (!langSelector || !langBtn) return;

    let currentLanguage = initialPreferredLanguage;
    let isSwitching = false;

    async function setLanguage(lang) {
        if (isSwitching && currentLanguage === lang) return;
        isSwitching = true;

        try {
            const translations = await fetchTranslations(lang);
            if (!translations) return;

            currentLanguage = lang;
            try {
                localStorage.setItem('tap_preferred_language', lang);
            } catch (err) { }

            document.documentElement.lang = lang;

            if (currentFlagIcon && flagSVGs[lang]) {
                currentFlagIcon.innerHTML = flagSVGs[lang];
            }
            if (currentLangText) {
                currentLangText.textContent = translations.langName || langNames[lang] || lang.toUpperCase();
            }

            langOptions.forEach(opt => {
                const optLang = opt.getAttribute('data-lang');
                const isActive = optLang === lang;
                opt.classList.toggle('is-active', isActive);
                opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            if (currentBadge && translations.currentBadge) {
                currentBadge.textContent = translations.currentBadge;
                const activeOptionLabel = document.querySelector(`.lang-option[data-lang="${lang}"] .lang-label`);
                if (activeOptionLabel && !activeOptionLabel.contains(currentBadge)) {
                    activeOptionLabel.appendChild(currentBadge);
                }
            }

            const transElements = document.querySelectorAll('[data-i18n]');
            transElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[key] !== undefined) {
                    el.textContent = translations[key];
                }
            });

            const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
            ariaElements.forEach(el => {
                const key = el.getAttribute('data-i18n-aria-label');
                if (translations[key] !== undefined) {
                    el.setAttribute('aria-label', translations[key]);
                }
            });

            const altElements = document.querySelectorAll('[data-i18n-alt]');
            altElements.forEach(el => {
                const key = el.getAttribute('data-i18n-alt');
                if (translations[key] !== undefined) {
                    el.setAttribute('alt', translations[key]);
                }
            });

            const titleElements = document.querySelectorAll('[data-i18n-title]');
            titleElements.forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                if (translations[key] !== undefined) {
                    el.setAttribute('title', translations[key]);
                }
            });

            if (translations.metaTitle) {
                document.title = translations.metaTitle;
            }

            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && translations.metaDescription) {
                metaDesc.setAttribute('content', translations.metaDescription);
            }

            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle && (translations.ogTitle || translations.metaTitle)) {
                ogTitle.setAttribute('content', translations.ogTitle || translations.metaTitle);
            }

            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc && (translations.ogDescription || translations.metaDescription)) {
                ogDesc.setAttribute('content', translations.ogDescription || translations.metaDescription);
            }

            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle && (translations.ogTitle || translations.metaTitle)) {
                twitterTitle.setAttribute('content', translations.ogTitle || translations.metaTitle);
            }

            const twitterDesc = document.querySelector('meta[name="twitter:description"]');
            if (twitterDesc && (translations.ogDescription || translations.metaDescription)) {
                twitterDesc.setAttribute('content', translations.ogDescription || translations.metaDescription);
            }

            window.dispatchEvent(new CustomEvent('tapLanguageChanged', {
                detail: { language: lang, translations }
            }));

            const alternateLang = lang === 'el' ? 'en' : 'el';
            if (!translationCache[alternateLang]) {
                fetchTranslations(alternateLang);
            }
        } finally {
            isSwitching = false;
        }
    }

    function openDropdown() {
        langSelector.classList.add('is-open');
        langBtn.setAttribute('aria-expanded', 'true');

        const nav = document.querySelector('.nav');
        const menuToggle = document.getElementById('mobile-menu');
        if (nav && nav.classList.contains('mobile-nav')) {
            nav.classList.remove('mobile-nav');
            if (menuToggle) {
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function closeDropdown() {
        langSelector.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown() {
        const isOpen = langSelector.classList.contains('is-open');
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const chosenLang = option.getAttribute('data-lang');
            setLanguage(chosenLang);
            closeDropdown();
            langBtn.focus();
        });

        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const chosenLang = option.getAttribute('data-lang');
                setLanguage(chosenLang);
                closeDropdown();
                langBtn.focus();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!langSelector.contains(e.target)) {
            closeDropdown();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && langSelector.classList.contains('is-open')) {
            closeDropdown();
            langBtn.focus();
        }
    });
    setLanguage(currentLanguage);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
}