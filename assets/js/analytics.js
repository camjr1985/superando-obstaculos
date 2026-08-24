/*!
 * Superando Obstáculos — GA4 loader com Consent Mode v2
 * Não carrega nenhum script do Google, nem grava cookies de analytics,
 * até que o visitante aceite explicitamente (RGPD/GDPR compliant).
 */
(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-7KDJ7YCV49";
  var CONSENT_KEY = "so_consent_v1";

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Consent Mode v2 — estado padrão: tudo negado até decisão do visitante.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });

  var gaScriptInjected = false;

  function injectGaScript() {
    if (gaScriptInjected) return;
    gaScriptInjected = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true,
      page_path: window.location.pathname + window.location.search
    });
  }

  function grantAnalyticsConsent() {
    gtag("consent", "update", { analytics_storage: "granted" });
    injectGaScript();
  }

  function denyAnalyticsConsent() {
    gtag("consent", "update", { analytics_storage: "denied" });
  }

  var eventQueue = [];
  var firedOnce = {};

  function sendEvent(name, params, opts) {
    params = params || {};
    opts = opts || {};

    // Deduplicação: eventos "once" (ex: scroll_50) só disparam uma vez por carregamento de página.
    if (opts.once) {
      var key = name + JSON.stringify(params.event_category || "");
      if (firedOnce[key]) return;
      firedOnce[key] = true;
    }

    var consent = getStoredConsent();
    if (consent === "granted") {
      gtag("event", name, params);
    }
    // Se não houver consentimento, o evento simplesmente não é enviado ao GA4.
  }

  function getStoredConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed.analytics ? "granted" : "denied";
    } catch (e) {
      return null;
    }
  }

  window.SOAnalytics = {
    grantAnalyticsConsent: grantAnalyticsConsent,
    denyAnalyticsConsent: denyAnalyticsConsent,
    sendEvent: sendEvent,
    getStoredConsent: getStoredConsent,
    CONSENT_KEY: CONSENT_KEY
  };

  // Se já havia consentimento de uma visita anterior, ativa GA imediatamente.
  if (getStoredConsent() === "granted") {
    grantAnalyticsConsent();
  }
})();
