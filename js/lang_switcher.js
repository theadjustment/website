(function () {
  'use strict';

  var STORAGE_KEY = 'tap_user_lang';

  function isEnglishPage() {
    var htmlLang = document.documentElement.lang || '';
    if (htmlLang.toLowerCase().indexOf('en') === 0) return true;
    var path = window.location.pathname.toLowerCase();
    return path.indexOf('/en/') !== -1 || path.endsWith('/en') || path.endsWith('/en/');
  }

  function getCurrentPageName() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    if (!filename || filename === '') filename = 'index.html';
    return filename;
  }

  function enforcePreferredLanguage() {
    try {
      var savedLang = localStorage.getItem(STORAGE_KEY);
      if (!savedLang) return;

      var isEn = isEnglishPage();
      var page = getCurrentPageName();
      var hash = window.location.hash || '';
      var search = window.location.search || '';

      if (savedLang === 'en' && !isEn) {
        var target = 'en/' + page + search + hash;
        window.location.replace(target);
      }

      else if (savedLang === 'el' && isEn) {
        var target = '../' + page + search + hash;
        window.location.replace(target);
      }
    } catch (e) {

    }
  }

  enforcePreferredLanguage();

  document.addEventListener('DOMContentLoaded', function () {
    var langBtn = document.getElementById('lang-btn');
    var langSelector = document.getElementById('lang-selector');

    if (langBtn && langSelector) {
      langBtn.addEventListener('click', function (e) {
        langSelector.classList.toggle('is-open');
        var expanded = langSelector.classList.contains('is-open');
        langBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        e.stopPropagation();
      });

      document.addEventListener('click', function (e) {
        if (!langSelector.contains(e.target)) {
          langSelector.classList.remove('is-open');
          langBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var langLinks = document.querySelectorAll('.lang-dropdown a, [data-lang]');
    langLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var chosenLang = link.getAttribute('data-lang');
        if (!chosenLang) {
          var href = link.getAttribute('href') || '';
          chosenLang = (href.indexOf('en') !== -1) ? 'en' : 'el';
        }

        try {
          localStorage.setItem(STORAGE_KEY, chosenLang);
        } catch (err) { }

        if (window.location.hash) {
          var currentHref = link.getAttribute('href');
          if (currentHref && currentHref.indexOf('#') === -1) {
            link.setAttribute('href', currentHref + window.location.hash);
          }
        }
      });
    });
  });
})();