(() => {
  const ID = "GTM-5FD73LGW";
  const KEY = "amable-analytics-consent";
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const text = isEnglish
    ? {
        title: "Analytics cookies",
        body: "Amable uses Google Tag Manager to measure how the website is used. The analytics tag only loads if you accept. You can change your choice at any time in the privacy settings.",
        privacy: "Privacy",
        reject: "Reject analytics",
        accept: "Accept analytics",
        manage: "Cookie settings"
      }
    : {
        title: "Cookies de analítica",
        body: "Amable utiliza Google Tag Manager para medir cómo se usa la web. La etiqueta de analítica solo se carga si aceptas. Puedes cambiar tu decisión cuando quieras desde la política de privacidad.",
        privacy: "Privacidad",
        reject: "Rechazar analítica",
        accept: "Aceptar analítica",
        manage: "Configurar cookies"
      };

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
      '<div class="amable-consent-copy"><strong id="amable-consent-title"></strong><p class="amable-consent-body"></p><a class="amable-consent-privacy" href="' +
      (isEnglish ? "/en/privacy" : "/privacidad") +
      '"></a></div><div class="amable-consent-actions"><button type="button" class="amable-consent-reject"></button><button type="button" class="amable-consent-accept"></button></div>';
    banner.querySelector("#amable-consent-title").textContent = text.title;
    banner.querySelector(".amable-consent-body").textContent = text.body;
    banner.querySelector(".amable-consent-privacy").textContent = text.privacy;
    banner.querySelector(".amable-consent-reject").textContent = text.reject;
    banner.querySelector(".amable-consent-accept").textContent = text.accept;
    banner.querySelector(".amable-consent-reject").addEventListener("click", () => saveChoice(false));
    banner.querySelector(".amable-consent-accept").addEventListener("click", () => saveChoice(true));
    document.body.appendChild(banner);
  }
  function ensureLauncher() {
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
    #amable-consent-banner{position:fixed;z-index:2147483000;left:50%;bottom:16px;transform:translateX(-50%);width:min(900px,calc(100% - 32px));padding:22px 24px;background:#fff;color:#111;border:1px solid rgba(17,17,17,.14);border-radius:18px;box-shadow:0 14px 48px rgba(0,0,0,.22);font:15px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:flex;align-items:flex-end;justify-content:space-between;gap:22px}
    #amable-consent-banner strong{font-size:17px}#amable-consent-banner p{margin:6px 0 4px;max-width:58em}
    #amable-consent-banner a{color:#004833;text-underline-offset:3px}
    .amable-consent-actions{display:flex;flex:none;gap:8px}
    .amable-consent-actions button,#amable-consent-launcher{font:600 14px/1.2 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}
    .amable-consent-actions button{min-height:44px;padding:10px 14px;border:1px solid #004833;border-radius:999px;background:#fff;color:#004833}
    .amable-consent-actions .amable-consent-accept{background:#004833;color:#fff}
    #amable-consent-launcher{position:fixed;z-index:2147482999;right:16px;bottom:16px;min-height:42px;padding:10px 14px;border:1px solid rgba(0,72,51,.35);border-radius:999px;background:#fff;color:#004833;box-shadow:0 4px 16px rgba(0,0,0,.12)}
    #amable-consent-banner button:focus-visible,#amable-consent-launcher:focus-visible{outline:3px solid #A8C8F8;outline-offset:2px}
    [data-amable-open-consent]{border:0;background:none;color:#004833;text-decoration:underline;font:inherit;cursor:pointer;padding:0}
    @media(max-width:700px){#amable-consent-banner{display:block;padding:18px 18px 16px;bottom:10px;max-height:calc(100vh - 20px);overflow:auto}.amable-consent-actions{margin-top:14px;justify-content:flex-end;flex-wrap:wrap}#amable-consent-launcher{right:10px;bottom:10px}}
  `;
  document.head.appendChild(style);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();