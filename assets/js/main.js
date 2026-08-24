/*!
 * Superando Obstáculos — main.js
 * Config central de links externos, UTM, navegação, consentimento e eventos GA4.
 *
 * PARA ATUALIZAR LINKS NO FUTURO: edite apenas o objeto CONFIG.links abaixo.
 * Todos os botões/links do site (incluindo o rodapé) são preenchidos
 * automaticamente a partir daqui — não é necessário editar o HTML.
 */
(function () {
  "use strict";

  var WHATSAPP_MESSAGE = "Olá! Conheci o projeto Superando Obstáculos e gostaria de saber mais sobre o livro.";

  var CONFIG = {
    links: {
      ppl: "https://ppl.pt/SuperandoObstaculos",
      catarse: "https://www.catarse.com.br/superando-obsta",
      linkedin: "https://www.linkedin.com/in/carlos-alexandre-marques-junior/",
      instagram: "https://www.instagram.com/descomplicagpagil/",
      whatsappPortugal: "https://wa.me/351913820958?text=" + encodeURIComponent(WHATSAPP_MESSAGE),
      whatsappBrasil: "https://wa.me/5511910940909?text=" + encodeURIComponent(WHATSAPP_MESSAGE)
    },
    utmStorageKey: "so_utm_v1",
    utmMaxAgeDays: 90
  };

  document.addEventListener("DOMContentLoaded", function () {
    applyConfiguredLinks();
    initUTM();
    initNav();
    initCookieConsent();
    initEventTracking();
    initScrollDepth();
    initReveal();
    initFooterYear();
  });

  /* ---------------- Links configurados ---------------- */
  function applyConfiguredLinks() {
    Object.keys(CONFIG.links).forEach(function (key) {
      var els = document.querySelectorAll('[data-link="' + key + '"]');
      els.forEach(function (el) {
        el.setAttribute("href", CONFIG.links[key]);
      });
    });
  }

  /* ---------------- UTM: captura e persistência ---------------- */
  function initUTM() {
    var params = new URLSearchParams(window.location.search);
    var utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    var found = {};
    var hasAny = false;

    utmKeys.forEach(function (k) {
      var v = params.get(k);
      if (v) {
        found[k] = v;
        hasAny = true;
      }
    });

    if (hasAny) {
      found._ts = Date.now();
      try {
        localStorage.setItem(CONFIG.utmStorageKey, JSON.stringify(found));
      } catch (e) {}
    }
  }

  function getPersistedUTM() {
    try {
      var raw = localStorage.getItem(CONFIG.utmStorageKey);
      if (!raw) return {};
      var data = JSON.parse(raw);
      var maxAge = CONFIG.utmMaxAgeDays * 24 * 60 * 60 * 1000;
      if (data._ts && Date.now() - data._ts > maxAge) return {};
      delete data._ts;
      return data;
    } catch (e) {
      return {};
    }
  }

  /* ---------------- Navegação (menu mobile) ---------------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("mobile-nav");
    if (!toggle || !panel) return;

    function closeNav() {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openNav() {
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------------- Consentimento de cookies (RGPD) ---------------- */
  function initCookieConsent() {
    var CONSENT_KEY = window.SOAnalytics ? window.SOAnalytics.CONSENT_KEY : "so_consent_v1";
    var banner = document.getElementById("consentBanner");
    var modalBackdrop = document.getElementById("consentModalBackdrop");
    var analyticsToggle = document.getElementById("analyticsToggle");

    var btnAccept = document.getElementById("btnAcceptCookies");
    var btnReject = document.getElementById("btnRejectCookies");
    var btnManage = document.getElementById("btnManageCookies");
    var btnSavePrefs = document.getElementById("btnSavePreferences");
    var btnRejectAllModal = document.getElementById("btnRejectAllModal");
    var footerTrigger = document.getElementById("openCookieSettingsFooter");

    if (!banner) return;

    function readConsent() {
      try {
        var raw = localStorage.getItem(CONSENT_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function writeConsent(analytics) {
      var payload = { necessary: true, analytics: !!analytics, ts: Date.now() };
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
      } catch (e) {}
      if (analytics && window.SOAnalytics) window.SOAnalytics.grantAnalyticsConsent();
      if (!analytics && window.SOAnalytics) window.SOAnalytics.denyAnalyticsConsent();
    }

    function hideBanner() {
      banner.classList.remove("is-visible");
      window.setTimeout(function () { banner.hidden = true; }, 350);
    }
    function showBanner() {
      banner.hidden = false;
      requestAnimationFrame(function () {
        window.setTimeout(function () { banner.classList.add("is-visible"); }, 30);
      });
    }
    function openModal() {
      var current = readConsent();
      if (analyticsToggle) analyticsToggle.checked = !!(current && current.analytics);
      modalBackdrop.hidden = false;
    }
    function closeModal() {
      modalBackdrop.hidden = true;
    }

    var existing = readConsent();
    if (!existing) {
      showBanner();
    }

    if (btnAccept) btnAccept.addEventListener("click", function () {
      writeConsent(true);
      hideBanner();
    });

    if (btnReject) btnReject.addEventListener("click", function () {
      writeConsent(false);
      hideBanner();
    });

    if (btnManage) btnManage.addEventListener("click", openModal);
    if (footerTrigger) footerTrigger.addEventListener("click", openModal);

    if (btnSavePrefs) btnSavePrefs.addEventListener("click", function () {
      writeConsent(analyticsToggle ? analyticsToggle.checked : false);
      closeModal();
      hideBanner();
    });

    if (btnRejectAllModal) btnRejectAllModal.addEventListener("click", function () {
      if (analyticsToggle) analyticsToggle.checked = false;
      writeConsent(false);
      closeModal();
      hideBanner();
    });

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", function (e) {
        if (e.target === modalBackdrop) closeModal();
      });
    }
  }

  /* ---------------- Eventos GA4 (cliques) ---------------- */
  var boundEvents = new WeakSet();

  function initEventTracking() {
    var elements = document.querySelectorAll("[data-event]");
    elements.forEach(function (el) {
      if (boundEvents.has(el)) return; // evita binding duplicado
      boundEvents.add(el);
      el.addEventListener("click", function () {
        var eventName = el.getAttribute("data-event");
        var label = el.getAttribute("data-event-label") || el.textContent.trim().slice(0, 60);
        var utm = getPersistedUTM();
        var params = Object.assign(
          {
            event_category: "engagement",
            event_label: label,
            link_url: el.getAttribute("href") || ""
          },
          utm
        );
        // click_whatsapp: distingue o destino (Portugal/Brasil) sem criar eventos novos.
        if (eventName === "click_whatsapp") {
          params.destination = "whatsapp";
          var region = el.getAttribute("data-whatsapp-region");
          if (region) params.whatsapp_region = region;
        }
        if (window.SOAnalytics) window.SOAnalytics.sendEvent(eventName, params);
      });
    });
  }

  /* ---------------- Scroll depth (50% / 90%) ---------------- */
  function initScrollDepth() {
    var fired50 = false;
    var fired90 = false;
    var ticking = false;

    function computeDepth() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var winHeight = window.innerHeight;
      var docHeight = Math.max(doc.scrollHeight, document.body.scrollHeight) - winHeight;
      if (docHeight <= 0) return 100;
      return Math.min(100, Math.round(((scrollTop + winHeight) / (docHeight + winHeight)) * 100));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var depth = computeDepth();
        if (!fired50 && depth >= 50) {
          fired50 = true;
          if (window.SOAnalytics) window.SOAnalytics.sendEvent("scroll_50", { event_category: "scroll" }, { once: true });
        }
        if (!fired90 && depth >= 90) {
          fired90 = true;
          if (window.SOAnalytics) window.SOAnalytics.sendEvent("scroll_90", { event_category: "scroll" }, { once: true });
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Reveal on scroll (discreto) ---------------- */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    targets.forEach(function (t) { observer.observe(t); });
  }

  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
