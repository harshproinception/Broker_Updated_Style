/* =========================================================================
   RETAL K2 THEME v2 - retal-runtime.js
   Replaces: Global.js (marker engine + layout), BR_InternalOpsPortal.js
   (marker engine only), BR_customComponentUI.js and Translation.js.

   Why: v1 ran two unthrottled MutationObservers on the whole page, three
   setInterval loops every 500 ms and the Google Translate website widget.
   This file runs ONE observer, batched to at most one pass per animation
   frame (and never more than every 120 ms), and uses K2's own translations.
   No jQuery needed.
   ========================================================================= */
(function () {
  "use strict";
  if (window.RetalRuntime) return;
  var VERSION = "2.0.0";
  document.documentElement.setAttribute("data-retal-theme", VERSION);
  if (window.console && console.info) console.info("[Retal K2 Theme] v" + VERSION + " loaded");

  /* ---------------------------------------------------------------- config */
  var CONFIG = {
    cultureParam: "_ui-culture",        // K2 runtime query-string parameter
    cultures: { en: "en-US", ar: "ar-SA" }, // must match Management > Translations > Selected Languages
    rememberCookie: "retal_lang",
    redirectToRememberedLanguage: true, // keeps Arabic when K2 rules navigate without the parameter
    minGapMs: 120
  };

  /* Elements whose ancestors get a marker class (union of v1 Global.js + BR_InternalOpsPortal.js) */
  var MARKERS = [
    ['[name="Add_cust_style_dlb"]', "pi-has-add-cust"],
    ['span[name="Projects_tab_List_dlb"]', "pi-has-projects-list"],
    ['span[name="MyCustomer_List_Style_dlb"]', "pi-has-mycust-list"],
    ['span[name="Ops_cards_style_dlb"]', "pi-has-ops-cards"],
    ['span[name="card_style_dlb"]', "pi-has-card-style"],
    ['[name="CustomerLeadDetailsStyleDlb"]', "pi-has-cld-style"],
    ['a[name="Home btn"]', "pi-has-home-btn"],
    [".retal-custom-header-layout", "pi-has-header-layout"],
    ['span[name="space_style_dlb"]', "pi-has-space-style"],
    ['[name="header_name_label"]', "pi-has-header-name"],
    ['[name="Header_style_dbl"]', "pi-has-header-style"],
    ['[name="PortalSelectionStyleDlb"]', "pi-has-portal-selection"]
  ];

  /* Status label -> pill class. Add the Arabic text exactly as loaded in K2 Translations. */
  var STATUS = {
    "status-ok": ["submitted", "active", "approved & active", "approved by retal", "extended by retal"],
    "status-warn": ["expiring soon", "pending approval", "under review by retal"],
    "status-danger": ["rejected", "rejected by retal", "expired", "expired by retal"],
    "status-suspended": ["suspended", "e-sign pending", "suspended by retal"]
  };

  /* Radio-card copy for the registration type step, in both languages */
  var RADIO_CARDS = {
    "Individual":    { icon: "user",   en: ["Individual", "A person acting as a broker."],        ar: ["فرد", "شخص يعمل وسيطاً عقارياً."] },
    "Company":       { icon: "office", en: ["Company", "A registered brokerage business."],       ar: ["شركة", "منشأة وساطة عقارية مسجلة."] },
    "Local":         { icon: "shield", en: ["Local (Saudi)", "Registered in Saudi Arabia."],      ar: ["محلي (سعودي)", "مسجل في المملكة العربية السعودية."] },
    "International": { icon: "globe",  en: ["International", "Registered outside Saudi Arabia."], ar: ["دولي", "مسجل خارج المملكة العربية السعودية."] }
  };
  /* Arabic copy above is a draft for Retal's translator to confirm. */

  var ICONS = {
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    office: '<rect x="6" y="3" width="12" height="18"/><path d="M10 8h.01M14 8h.01M10 12h.01M14 12h.01M10 16h.01M14 16h.01"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
  };

  /* ------------------------------------------------------------- language */
  function getCookie(n) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + n.replace(/[.$?*|{}()\[\]\\\/+^]/g, "\\$&") + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(n, v) {
    document.cookie = n + "=" + encodeURIComponent(v) + "; path=/; max-age=31536000; SameSite=Lax; Secure";
  }
  function clearGoogleTranslateCookie() {
    var host = location.hostname, parts = host.split(".");
    var base = parts.length > 2 ? "." + parts.slice(-2).join(".") : host;
    ["", "; domain=" + host, "; domain=" + base].forEach(function (d) {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
    });
  }
  function urlCulture() {
    try { return new URL(location.href).searchParams.get(CONFIG.cultureParam); } catch (e) { return null; }
  }
  function urlWithCulture(culture) {
    var u = new URL(location.href);
    u.searchParams.set(CONFIG.cultureParam, culture);
    return u.toString();
  }
  function currentLang() {
    var c = urlCulture() || getCookie(CONFIG.rememberCookie) || "";
    return /^ar/i.test(c) ? "ar" : "en";
  }
  function applyLang() {
    var lang = currentLang(), rtl = lang === "ar";
    var html = document.documentElement, body = document.body;
    html.setAttribute("lang", rtl ? "ar" : "en");
    html.setAttribute("dir", rtl ? "rtl" : "ltr");
    if (body) {
      body.setAttribute("dir", rtl ? "rtl" : "ltr");             // v1 CSS uses body[dir="rtl"]
      body.classList.toggle("translated-rtl", rtl);               // v1 CSS compatibility
      body.classList.toggle("translated-ltr", !rtl);
    }
    var ar = document.querySelector('[name="btnArabic"]'), en = document.querySelector('[name="btnEnglish"]');
    if (ar) ar.classList.toggle("hidden", rtl);
    if (en) en.classList.toggle("hidden", !rtl);
    return lang;
  }
  function switchLang(lang) {
    var culture = CONFIG.cultures[lang];
    setCookie(CONFIG.rememberCookie, culture);
    location.assign(urlWithCulture(culture));   // K2 renders the form in that culture
  }
  /* Exposed for K2 rules or legacy buttons */
  window.translateToArabic = function () { switchLang("ar"); };
  window.translateToEnglish = function () { switchLang("en"); };

  function redirectIfNeeded() {
    if (!CONFIG.redirectToRememberedLanguage || urlCulture()) return false;
    var remembered = getCookie(CONFIG.rememberCookie);
    if (remembered && /^ar/i.test(remembered)) {
      location.replace(urlWithCulture(remembered));
      return true;
    }
    return false;
  }

  /* -------------------------------------------------------------- markers */
  function syncMarkers() {
    for (var m = 0; m < MARKERS.length; m++) {
      var cls = MARKERS[m][1], want = new Set();
      var nodes = document.querySelectorAll(MARKERS[m][0]);
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i].parentElement;
        while (el && !want.has(el)) { want.add(el); el = el.parentElement; }
      }
      want.forEach(function (e) { if (!e.classList.contains(cls)) e.classList.add(cls); });
      var stale = document.getElementsByClassName(cls);
      for (var s = stale.length - 1; s >= 0; s--) if (!want.has(stale[s])) stale[s].classList.remove(cls);
    }
  }

  /* --------------------------------------------- header + sidebar (Global.js) */
  var NAV_RULES = [
    [/opsteam\.customerdetail\.form/, null],
    [/customer.*add|add.*customer/, "Add custm btn"],
    [/projects|customerjourney\.selectedbroker\.form/, "Project btn"],
    [/configuration/, "Configuration btn"],
    [/worklist/, "Worklist btn"],
    [/mycustomerslead/, "My cust lead btn"],
    [/my.*customer|all.*customer|customerdetailsrega|brokercustomerdetails/, "My custm btn"]
  ];
  function layout() {
    var hdr = document.querySelector('span[name="Header_style_dbl"]');
    var target = hdr ? hdr.closest("div.Grid-Layout.root-table") : document.querySelector(".form .row:first-child .root-table");
    if (target && !target.classList.contains("retal-custom-header-layout")) target.classList.add("retal-custom-header-layout");

    var home = document.querySelector('.form a[name="Home btn"]');
    var row = home && home.closest(".row");
    if (row && !row.hasAttribute("data-retal-nav")) {
      row.setAttribute("data-retal-nav", "1");
      var url = location.href.toLowerCase(), active = "Home btn";
      for (var i = 0; i < NAV_RULES.length; i++) if (NAV_RULES[i][0].test(url)) { active = NAV_RULES[i][1]; break; }
      var btns = row.querySelectorAll("a.SourceCode-Forms-Controls-Web-Button");
      for (var b = 0; b < btns.length; b++) btns[b].classList.toggle("active-nav", btns[b].getAttribute("name") === active);
    }

    var lbls = document.querySelectorAll('[name="project_may_broker_lbl"]');
    for (var j = 0; j < lbls.length; j++) { var g = lbls[j].closest(".Grid-Layout"); if (g) g.classList.add("detail-table"); }

    if (document.body) document.body.classList.toggle("retal-sticky-footer", !!document.querySelector('[name*="Footer" i]'));
  }

  /* ------------------------------------------- registration radio cards */
  function radioCards(lang) {
    var labels = document.querySelectorAll("label.radio[title]");
    for (var i = 0; i < labels.length; i++) {
      var l = labels[i], def = RADIO_CARDS[l.getAttribute("title")];
      if (!def || l.getAttribute("data-retal-card") === lang) continue;
      var target = l.querySelector(".input-control-text");
      if (!target) continue;
      var copy = def[lang] || def.en;
      target.innerHTML =
        '<div class="radio-card-content"><div class="radio-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        ICONS[def.icon] + "</svg></div><h3></h3><p></p></div>";
      target.querySelector("h3").textContent = copy[0];
      target.querySelector("p").textContent = copy[1];
      l.setAttribute("data-retal-card", lang);
    }
  }

  /* --------------------------------------------------------- status pills */
  var STATUS_INDEX = {};
  Object.keys(STATUS).forEach(function (cls) { STATUS[cls].forEach(function (t) { STATUS_INDEX[t] = cls; }); });
  function statusPills() {
    var spans = document.querySelectorAll('span[name="dlbApplicationStatus"]');
    for (var i = 0; i < spans.length; i++) {
      var s = spans[i], t = (s.textContent || "").trim().toLowerCase();
      if (!t || s.getAttribute("data-applied-status") === t) continue;
      s.setAttribute("data-applied-status", t);
      s.classList.remove("status-ok", "status-warn", "status-danger", "status-suspended");
      if (STATUS_INDEX[t]) s.classList.add(STATUS_INDEX[t]);
    }
  }

  /* ------------------------------------------------------------ scheduler */
  var lang = "en", queued = false, last = 0;
  function pass() {
    queued = false; last = Date.now();
    try { syncMarkers(); layout(); radioCards(lang); statusPills(); } catch (e) { if (window.console) console.warn("[RetalRuntime]", e); }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    var wait = Math.max(0, CONFIG.minGapMs - (Date.now() - last));
    setTimeout(function () { requestAnimationFrame(pass); }, wait);
  }

  function start() {
    clearGoogleTranslateCookie();
    if (redirectIfNeeded()) return;
    lang = applyLang();
    pass();
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) if (records[i].addedNodes.length || records[i].type === "characterData") return schedule();
    }).observe(document.body, { childList: true, subtree: true, characterData: true });

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('[name="btnArabic"]')) { e.preventDefault(); switchLang("ar"); return; }
      if (t.closest('[name="btnEnglish"]')) { e.preventDefault(); switchLang("en"); return; }
      var btn = t.closest(".form a.SourceCode-Forms-Controls-Web-Button");
      var row = btn && btn.closest(".row");
      if (row && row.querySelector('a[name="Home btn"]') && btn.getAttribute("name") !== "Retal_Cat_Btn") {
        var all = row.querySelectorAll("a.SourceCode-Forms-Controls-Web-Button");
        for (var i = 0; i < all.length; i++) all[i].classList.toggle("active-nav", all[i] === btn);
      }
    }, true);
  }

  window.RetalRuntime = { version: VERSION, config: CONFIG, refresh: pass, setLanguage: switchLang };
  window.piSyncPageMarkers = syncMarkers;           // v1 name, still called by some views
  window.piSyncOpsAndMyCustomerMarkers = syncMarkers;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
