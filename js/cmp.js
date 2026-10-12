(function () {
  'use strict';

  var STORAGE_KEY = 'tap_cookie_consent_v1';
  var GA_MEASUREMENT_ID = 'G-139980KF6X';
  var isEnglish = document.documentElement.lang && document.documentElement.lang.toLowerCase().indexOf('en') === 0;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });

  var i18n = {
    el: {
      badgeLabel: 'Ρυθμίσεις Cookies',
      bannerTitle: 'Επιλογές Απορρήτου & Cookies',
      bannerText: 'Χρησιμοποιούμε cookies και παρόμοιες τεχνολογίες για τη διασφάλιση της ορθής λειτουργίας του ιστότοπου, τη συλλογή ανώνυμων στατιστικών επισκεψιμότητας (Google Analytics) και την προβολή διαδραστικού χάρτη (Google Maps). Μπορείτε να επιλέξετε ποιες κατηγορίες αποδέχεστε. Για περισσότερα, διαβάστε την <a href="privacy-policy.html">Πολιτική Απορρήτου</a> και την <a href="cookie-policy.html">Πολιτική Cookies</a>.',
      acceptAll: 'Αποδοχή Όλων',
      rejectNonEssential: 'Αποδοχή Απαραίτητων',
      customize: 'Ρυθμίσεις',
      modalTitle: 'Προτιμήσεις Cookies & Απορρήτου',
      modalIntro: 'Μπορείτε να ρυθμίσετε τις προτιμήσεις σας παρακάτω. Τα απαραίτητα cookies είναι πάντα ενεργά για τη βασική λειτουργία της ιστοσελίδας.',
      savePreferences: 'Αποθήκευση Επιλογών',
      close: 'Κλείσιμο',
      alwaysActive: 'Πάντα Ενεργό',
      catNecessaryTitle: 'Απολύτως Απαραίτητα',
      catNecessaryDesc: 'Απαιτούνται για τη βασική λειτουργία του ιστότοπου και την αποθήκευση των προτιμήσεών σας για τα cookies. Δεν μπορούν να απενεργοποιηθούν.',
      catAnalyticsTitle: 'Στατιστικά / Google Analytics',
      catAnalyticsDesc: 'Μας βοηθούν να κατανοήσουμε ανώνυμα πώς χρησιμοποιούν οι επισκέπτες την ιστοσελίδα μέσω της υπηρεσίας Google Analytics 4 (Google LLC).',
      catMapsTitle: 'Διαδραστικός Χάρτης / Google Maps',
      catMapsDesc: 'Επιτρέπουν τη φόρτωση του διαδραστικού χάρτη τοποθεσίας της Google LLC στην ενότητα Επικοινωνίας. Η ενεργοποίηση ενδέχεται να μεταφέρει τη διεύθυνση IP σας στη Google.',
      mapBlockedTitle: 'Διαδραστικός Χάρτης Google Maps',
      mapBlockedDesc: 'Ο χάρτης παραμένει ανενεργός για την προστασία των προσωπικών σας δεδομένων. Για να τον προβάλετε, απαιτείται η ενεργοποίηση cookies εξωτερικού περιεχομένου.',
      mapEnableBtn: 'Ενεργοποίηση & Προβολή Χάρτη',
      mapExternalLink: 'Άνοιγμα εξωτερικά στο Google Maps',
      privacyLink: 'Πολιτική Απορρήτου',
      cookiePolicyLink: 'Πολιτική Cookies'
    },
    en: {
      badgeLabel: 'Cookie Settings',
      bannerTitle: 'Privacy & Cookies Choices',
      bannerText: 'We use cookies and similar technologies to ensure core website functionality, analyze anonymous traffic (Google Analytics), and embed an interactive location map (Google Maps). You can choose which categories you accept. For details, please review our <a href="privacy-policy.html">Privacy Policy</a> and <a href="cookie-policy.html">Cookie Policy</a>.',
      acceptAll: 'Accept All',
      rejectNonEssential: 'Accept Necessary',
      customize: 'Preferences',
      modalTitle: 'Cookie & Privacy Preferences',
      modalIntro: 'Customize your preferences below. Strictly necessary cookies are always active to maintain basic website security and navigation.',
      savePreferences: 'Save Preferences',
      close: 'Close',
      alwaysActive: 'Always Active',
      catNecessaryTitle: 'Strictly Necessary',
      catNecessaryDesc: 'Essential for technical operation and remembering your consent preferences. These cannot be disabled.',
      catAnalyticsTitle: 'Analytics / Google Analytics',
      catAnalyticsDesc: 'Enables Google Analytics 4 (Google LLC) to collect anonymous metrics about how our visitors interact with the site.',
      catMapsTitle: 'Interactive Map / Google Maps',
      catMapsDesc: 'Allows loading the interactive Google Maps embed in the contact section. Enabling this may transmit your IP address to Google LLC.',
      mapBlockedTitle: 'Interactive Google Map',
      mapBlockedDesc: 'This map is blocked to protect your privacy. To view the interactive location map, consent for external media cookies is required.',
      mapEnableBtn: 'Enable & View Google Map',
      mapExternalLink: 'Open directly in Google Maps',
      privacyLink: 'Privacy Policy',
      cookiePolicyLink: 'Cookie Policy'
    }
  };

  var strings = isEnglish ? i18n.en : i18n.el;
  var policyPrefix = isEnglish ? '/en/' : '/';

  function getStoredConsent() {
    try {
      var item = localStorage.getItem(STORAGE_KEY);
      if (!item) return null;
      var parsed = JSON.parse(item);
      if (typeof parsed === 'object' && parsed !== null && 'analytics' in parsed && 'maps' in parsed) {
        return parsed;
      }
    } catch (e) {
    }
    return null;
  }

  function saveConsent(state) {
    var payload = {
      necessary: true,
      analytics: Boolean(state.analytics),
      maps: Boolean(state.maps),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
    }
    applyConsent(payload);
  }

  var gaScriptInjected = false;

  function applyAnalytics(granted) {
    if (granted) {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });

      if (!gaScriptInjected) {
        var existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
        if (!existingScript) {
          var script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
          document.head.appendChild(script);
        }
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
        gaScriptInjected = true;
      }
    } else {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });

      try {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          var eqPos = cookie.indexOf('=');
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          if (name.indexOf('_ga') === 0) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';
          }
        }
      } catch (e) {
      }
    }
  }

  function applyMaps(granted) {
    var mapContainers = document.querySelectorAll('.map-container');
    if (!mapContainers.length) return;

    mapContainers.forEach(function (container) {
      var embedSrc = container.getAttribute('data-src') ||
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.215909786968!2d23.800469076837256!3d37.8318309719711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4fa8a4b26e5c45d5%3A0xa3ca2a22623297a9!2sThe%20Adjustment%20Point!5e0!3m2!1sen!2sgr!4v1789498225098!5m2!1sen!2sgr';

      var externalUrl = 'https://maps.app.goo.gl/6xaPBVVygRNUeTxE6';

      if (granted) {
        var currentIframe = container.querySelector('iframe');
        if (!currentIframe) {
          container.innerHTML = '';
          var iframe = document.createElement('iframe');
          iframe.src = embedSrc;
          iframe.style.border = '0';
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          iframe.title = isEnglish ? 'The Adjustment Point location map' : 'Χάρτης τοποθεσίας The Adjustment Point';
          container.appendChild(iframe);
        }
      } else {
        container.innerHTML = [
          '<div class="map-blocked-placeholder">',
          '<div class="map-blocked-card">',
          '<svg class="map-blocked-icon" viewBox="0 0 24 24" aria-hidden="true">',
          '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
          '</svg>',
          '<h3 class="map-blocked-title">' + strings.mapBlockedTitle + '</h3>',
          '<p class="map-blocked-text">' + strings.mapBlockedDesc + '</p>',
          '<div class="map-blocked-actions">',
          '<button type="button" class="map-blocked-btn" id="tap-enable-maps-btn">',
          strings.mapEnableBtn,
          '</button>',
          '<a href="' + externalUrl + '" target="_blank" rel="noopener noreferrer" class="map-blocked-external-link">',
          strings.mapExternalLink + ' &rarr;',
          '</a>',
          '</div>',
          '</div>',
          '</div>'
        ].join('');

        var enableBtn = container.querySelector('#tap-enable-maps-btn');
        if (enableBtn) {
          enableBtn.addEventListener('click', function () {
            var current = getStoredConsent() || { necessary: true, analytics: false, maps: false };
            current.maps = true;
            saveConsent(current);
          });
        }
      }
    });
  }

  function applyConsent(state) {
    applyAnalytics(state.analytics);
    applyMaps(state.maps);
  }

  function createCookieBadge() {
    if (document.getElementById('tap-cmp-badge')) return;

    var badge = document.createElement('button');
    badge.id = 'tap-cmp-badge';
    badge.className = 'tap-cmp-badge';
    badge.type = 'button';
    badge.setAttribute('aria-label', strings.badgeLabel);
    badge.innerHTML = [
      '<svg viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.55-.45-1-1-1-1.66 0-3-1.34-3-3 0-.55-.45-1-1-1-1.66 0-3-1.34-3-3 0-.55-.45-1-1-1zm-3 8.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5.5-2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
      '</svg>',
      '<span>' + strings.badgeLabel + '</span>'
    ].join('');

    badge.addEventListener('click', function () {
      openPreferencesModal();
    });

    document.body.appendChild(badge);
  }

  function showBanner() {
    if (document.getElementById('tap-cmp-banner-wrapper')) return;

    var wrapper = document.createElement('div');
    wrapper.id = 'tap-cmp-banner-wrapper';
    wrapper.className = 'tap-cmp-banner-wrapper';

    wrapper.innerHTML = [
      '<aside class="tap-cmp-banner" role="dialog" aria-modal="false" aria-label="' + strings.bannerTitle + '">',
      '<div class="tap-cmp-banner-header">',
      '<h2 class="tap-cmp-banner-title">' + strings.bannerTitle + '</h2>',
      '</div>',
      '<div class="tap-cmp-banner-text">' + strings.bannerText + '</div>',
      '<div class="tap-cmp-banner-actions">',
      '<button type="button" class="tap-cmp-btn tap-cmp-btn-ghost" id="tap-cmp-btn-customize">' + strings.customize + '</button>',
      '<button type="button" class="tap-cmp-btn tap-cmp-btn-secondary" id="tap-cmp-btn-reject">' + strings.rejectNonEssential + '</button>',
      '<button type="button" class="tap-cmp-btn tap-cmp-btn-primary" id="tap-cmp-btn-accept-all">' + strings.acceptAll + '</button>',
      '</div>',
      '</aside>'
    ].join('');

    document.body.appendChild(wrapper);

    wrapper.querySelector('#tap-cmp-btn-accept-all').addEventListener('click', function () {
      saveConsent({ analytics: true, maps: true });
      closeBanner();
    });

    wrapper.querySelector('#tap-cmp-btn-reject').addEventListener('click', function () {
      saveConsent({ analytics: false, maps: false });
      closeBanner();
    });

    wrapper.querySelector('#tap-cmp-btn-customize').addEventListener('click', function () {
      openPreferencesModal();
    });
  }

  function closeBanner() {
    var wrapper = document.getElementById('tap-cmp-banner-wrapper');
    if (wrapper) {
      wrapper.remove();
    }
  }

  function openPreferencesModal() {
    if (document.getElementById('tap-cmp-modal-overlay')) return;

    var current = getStoredConsent() || { analytics: false, maps: false };

    var overlay = document.createElement('div');
    overlay.id = 'tap-cmp-modal-overlay';
    overlay.className = 'tap-cmp-modal-overlay';

    overlay.innerHTML = [
      '<div class="tap-cmp-modal" role="dialog" aria-modal="true" aria-labelledby="tap-modal-title">',
      '<div class="tap-cmp-modal-header">',
      '<h2 class="tap-cmp-modal-title" id="tap-modal-title">' + strings.modalTitle + '</h2>',
      '<button type="button" class="tap-cmp-modal-close" id="tap-modal-close" aria-label="' + strings.close + '">',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '<line x1="18" y1="6" x2="6" y2="18"></line>',
      '<line x1="6" y1="6" x2="18" y2="18"></line>',
      '</svg>',
      '</button>',
      '</div>',
      '<div class="tap-cmp-modal-body">',
      '<p class="tap-cmp-modal-intro">' + strings.modalIntro + '</p>',
      '<div class="tap-cmp-category-list">',

      '<div class="tap-cmp-category">',
      '<div class="tap-cmp-category-header">',
      '<div class="tap-cmp-category-title-wrap">',
      '<h3 class="tap-cmp-category-name">' + strings.catNecessaryTitle + '</h3>',
      '<span class="tap-cmp-badge-tag">' + strings.alwaysActive + '</span>',
      '</div>',
      '<label class="tap-cmp-switch">',
      '<input type="checkbox" checked disabled>',
      '<span class="tap-cmp-slider"></span>',
      '</label>',
      '</div>',
      '<p class="tap-cmp-category-desc">' + strings.catNecessaryDesc + '</p>',
      '</div>',

      '<div class="tap-cmp-category">',
      '<div class="tap-cmp-category-header">',
      '<div class="tap-cmp-category-title-wrap">',
      '<h3 class="tap-cmp-category-name">' + strings.catAnalyticsTitle + '</h3>',
      '</div>',
      '<label class="tap-cmp-switch">',
      '<input type="checkbox" id="tap-pref-analytics" ' + (current.analytics ? 'checked' : '') + '>',
      '<span class="tap-cmp-slider"></span>',
      '</label>',
      '</div>',
      '<p class="tap-cmp-category-desc">' + strings.catAnalyticsDesc + '</p>',
      '</div>',

      '<div class="tap-cmp-category">',
      '<div class="tap-cmp-category-header">',
      '<div class="tap-cmp-category-title-wrap">',
      '<h3 class="tap-cmp-category-name">' + strings.catMapsTitle + '</h3>',
      '</div>',
      '<label class="tap-cmp-switch">',
      '<input type="checkbox" id="tap-pref-maps" ' + (current.maps ? 'checked' : '') + '>',
      '<span class="tap-cmp-slider"></span>',
      '</label>',
      '</div>',
      '<p class="tap-cmp-category-desc">' + strings.catMapsDesc + '</p>',
      '</div>',

      '</div>',
      '</div>',
      '<div class="tap-cmp-modal-footer">',
      '<button type="button" class="tap-cmp-btn tap-cmp-btn-secondary" id="tap-pref-reject">' + strings.rejectNonEssential + '</button>',
      '<div class="tap-cmp-modal-footer-actions">',
      '<button type="button" class="tap-cmp-btn tap-cmp-btn-primary" id="tap-pref-save">' + strings.savePreferences + '</button>',
      '<button type="button" class="tap-cmp-btn tap-cmp-btn-primary" id="tap-pref-accept-all" style="background-color: var(--primary-green);">' + strings.acceptAll + '</button>',
      '</div>',
      '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(overlay);

    function closeModal() {
      overlay.remove();
    }

    overlay.querySelector('#tap-modal-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function handleEscape(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    });

    overlay.querySelector('#tap-pref-save').addEventListener('click', function () {
      var analytics = overlay.querySelector('#tap-pref-analytics').checked;
      var maps = overlay.querySelector('#tap-pref-maps').checked;
      saveConsent({ analytics: analytics, maps: maps });
      closeBanner();
      closeModal();
    });

    overlay.querySelector('#tap-pref-accept-all').addEventListener('click', function () {
      saveConsent({ analytics: true, maps: true });
      closeBanner();
      closeModal();
    });

    overlay.querySelector('#tap-pref-reject').addEventListener('click', function () {
      saveConsent({ analytics: false, maps: false });
      closeBanner();
      closeModal();
    });
  }

  window.openCookieSettings = openPreferencesModal;

  function init() {
    createCookieBadge();
    document.querySelectorAll('.tap-cookie-settings-trigger, [data-open-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openPreferencesModal();
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('.clinic-book-btn')) {
        gtag('event', 'book_appointment');
      }
    });

    var existingConsent = getStoredConsent();

    if (existingConsent) {
      applyConsent(existingConsent);
    } else {
      applyConsent({ necessary: true, analytics: false, maps: false });
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();