(() => {
  const ID = "GTM-5FD73LGW";
  const KEY = "amable-analytics-consent";
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const text = isEnglish
    ? { body: "We use analytics cookies to improve the site, only if you say yes.", privacy: "More info", reject: "No thanks", accept: "OK" }
    : { body: "Usamos cookies de analítica para mejorar la web, solo si aceptas.", privacy: "Más info", reject: "No, gracias", accept: "Vale" };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });

  let loaded = false;
  function updateConsent(granted) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }
  function loadTagManager() {
    if (loaded) return;
    loaded = true;
    window.gtag("js", new Date());
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(ID);
    document.head.appendChild(script);
  }
  function saveChoice(granted) {
    try { localStorage.setItem(KEY, granted ? "granted" : "denied"); } catch (_) {}
    updateConsent(granted);
    if (granted) loadTagManager();
    const banner = document.getElementById("amable-consent-banner");
    if (banner) banner.remove();
    ensureLauncher();
  }
  function openBanner() {
    if (document.getElementById("amable-consent-banner")) return;
    const banner = document.createElement("section");
    banner.id = "amable-consent-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-labelledby", "amable-consent-title");
    banner.innerHTML =
      '<p class="amable-consent-body" id="amable-consent-title"><span></span> <a class="amable-consent-privacy" href="' +
      (isEnglish ? "/en/privacy" : "/privacidad") +
      '"></a></p><div class="amable-consent-actions"><button type="button" class="amable-consent-reject"></button><button type="button" class="amable-consent-accept"></button></div>';
    banner.querySelector(".amable-consent-body span").textContent = text.body;
    banner.querySelector(".amable-consent-privacy").textContent = text.privacy;
    banner.querySelector(".amable-consent-reject").textContent = text.reject;
    banner.querySelector(".amable-consent-accept").textContent = text.accept;
    banner.querySelector(".amable-consent-reject").addEventListener("click", () => saveChoice(false));
    banner.querySelector(".amable-consent-accept").addEventListener("click", () => saveChoice(true));
    document.body.appendChild(banner);
  }
  function ensureLauncher() {
    return;
    if (document.getElementById("amable-consent-launcher")) return;
    const launcher = document.createElement("button");
    launcher.id = "amable-consent-launcher";
    launcher.type = "button";
    launcher.textContent = text.manage;
    launcher.addEventListener("click", openBanner);
    document.body.appendChild(launcher);
  }
  function init() {
    const choice = (() => { try { return localStorage.getItem(KEY); } catch (_) { return null; } })();
    if (choice === "granted") {
      updateConsent(true);
      loadTagManager();
    } else if (choice !== "denied") {
      openBanner();
    }
    ensureLauncher();
    document.querySelectorAll("[data-amable-open-consent]").forEach((button) => button.addEventListener("click", openBanner));
  }

  const style = document.createElement("style");
  style.textContent = `
    #amable-consent-banner{position:fixed;z-index:2147483000;left:16px;bottom:16px;width:min(380px,calc(100% - 32px));padding:16px 18px;background:#fff;color:#111;border:1px solid rgba(17,17,17,.12);border-radius:16px;box-shadow:0 12px 36px rgba(0,0,0,.18);font:14.5px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #amable-consent-banner p{margin:0 0 12px}
    #amable-consent-banner a{color:#004833;text-underline-offset:3px;white-space:nowrap}
    .amable-consent-actions{display:flex;gap:8px}.amable-consent-actions button{flex:1}
    .amable-consent-actions button,#amable-consent-launcher{font:600 14px/1.2 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}
    .amable-consent-actions button{min-height:42px;padding:9px 14px;border:1px solid #004833;border-radius:999px;background:#fff;color:#004833}
    .amable-consent-actions .amable-consent-accept{background:#004833;color:#fff}
    #amable-consent-launcher{position:fixed;z-index:2147482999;right:16px;bottom:16px;min-height:42px;padding:10px 14px;border:1px solid rgba(0,72,51,.35);border-radius:999px;background:#fff;color:#004833;box-shadow:0 4px 16px rgba(0,0,0,.12)}
    #amable-consent-banner button:focus-visible,#amable-consent-launcher:focus-visible{outline:3px solid #A8C8F8;outline-offset:2px}
    [data-amable-open-consent]{border:0;background:none;color:#004833;text-decoration:underline;font:inherit;cursor:pointer;padding:0}
    @media(max-width:700px){#amable-consent-banner{left:10px;right:10px;bottom:10px;width:auto}}
  `;
  document.head.appendChild(style);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();