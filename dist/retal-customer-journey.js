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

;
$(document).ready(function () {
    function formatViewDashboard() {
        var $cardsAnchor = $('span[name="card_style_dlb"]');
        if ($cardsAnchor.length === 0) return;

        var $viewContainer = $cardsAnchor.closest('.view, .runtime-content, .panel');
        if ($viewContainer.length === 0) {
            $viewContainer = $('.runtime-content, .panel').first();
        }
        if ($viewContainer.length === 0) {
            $viewContainer = $(document);
        }

        // 1. Banner & Button Formatting
        var bannerCell = $viewContainer.find('span[name="Cell Notification"]');
        if (bannerCell.length && !bannerCell.hasClass('custom-banner-applied')) {
            bannerCell.addClass('custom-banner-applied');

            var welcomeLbl = $viewContainer.find('[name="Label_welcome"]');
            var nameLbl = $viewContainer.find('[name="Notification_name dlb"]');
            var companyLbl = $viewContainer.find('[name="Nortification_Company_Name_dlb"]');
            var descLbl = $viewContainer.find('[name="NotificationDesc_label"]');
            var btn = $viewContainer.find('[name="addcustomer_Btn"]');

            if (bannerCell.find('.banner-left-group').length === 0) {
                var iconHtml = '<div class="banner-icon-wrapper"><svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg></div>';
                var textWrapper = $('<div class="banner-text-wrapper"></div>');
                var titleWrapper = $('<div class="banner-title"></div>');

                titleWrapper.append(welcomeLbl).append(nameLbl).append(companyLbl);
                textWrapper.append(titleWrapper).append(descLbl);

                var leftGroup = $('<div class="banner-left-group"></div>').append(iconHtml).append(textWrapper);
                bannerCell.prepend(leftGroup);
            }

            if (btn.find('svg').length === 0) {
                btn.prepend('<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>');
            }
            btn.addClass('custom-btn');
        }

        // 2. Metric Cards Formatting
        var cardsTable = $viewContainer.find('div[name="Table cards"]');
        if (cardsTable.length) {
            cardsTable.addClass('custom-cards-table');

            var cardIcons = [
                { svg: '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#8D624B" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>', bg: 'bg-icon-0' },
                { svg: '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#B87B41" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', bg: 'bg-icon-1' },
                { svg: '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#D97706" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', bg: 'bg-icon-2' },
                { svg: '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#50935A" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>', bg: 'bg-icon-3' }
            ];

            var $cells = cardsTable.children('span[name*="Cell"], .editor-cell');
            $cells.each(function (idx) {
                var $cell = $(this);
                $cell.addClass('custom-card');

                var $numBtn = $cell.find('a.SourceCode-Forms-Controls-Web-Button, a[name*="Button"]');
                var $lbl = $cell.find('span.SourceCode-Forms-Controls-Web-Label, span[name*="label"], span[name*="Label"]');

                $numBtn.addClass('card-number-btn');
                $lbl.addClass('card-label');

                var iconData = cardIcons[idx % cardIcons.length];
                if ($cell.find('.card-icon-wrapper').length === 0) {
                    $cell.prepend('<div class="card-icon-wrapper ' + iconData.bg + '">' + iconData.svg + '</div>');
                }
            });
        }
    }

    // High-performance delegated card click handler (replaces binding on every individual element)
    $(document).on('click', '.custom-card', function (e) {
        if (!$(e.target).is('a, button, .card-number-btn')) {
            var targetBtn = $(this).find('a.SourceCode-Forms-Controls-Web-Button, a[name*="Button"], .card-number-btn').first();
            if (targetBtn.length) {
                targetBtn[0].click();
            }
        }
    });

    formatViewDashboard();

    // PERF: debounced - batches multiple rapid K2 AJAX updates
    var cardTimer = null;
    $(document).ajaxComplete(function () {
        if (cardTimer) return;
        cardTimer = setTimeout(function () {
            cardTimer = null;
            formatViewDashboard();
        }, 100);
    });
});

;
(function () {

    function getMainRuntimeForm() {
        var forms = document.querySelectorAll(".theme-entry .runtime-form");

        for (var i = 0; i < forms.length; i++) {
            if (!forms[i].closest(".popup")) {
                return forms[i];
            }
        }

        return document.querySelector(".theme-entry .runtime-form");
    }

    function markMainForm() {
        var form = getMainRuntimeForm();

        if (!form) {
            return null;
        }

        form.classList.add("main-customer-form");

        return form;
    }

    function getGlobalHeaderRow() {
        var marker = document.querySelector(
            '.theme-entry [name="Header_style_dbl"]'
        );

        if (!marker) {
            return null;
        }

        var table = marker.closest(
            ".Grid-Layout.root-table"
        );

        if (!table) {
            return null;
        }

        return table.closest(".row");
    }

    function getCustomerHeaderRow() {

        var marker = document.querySelector(
            '.theme-entry [name="Data Label Customer Name"]'
        );

        if (!marker) {
            return null;
        }

        return marker.closest(".row");
    }

    // PERF: only write inline styles when they differ - avoids repeated
    // style invalidation on every pass.
    function setImportant(el, prop, value) {
        if (
            el.style.getPropertyValue(prop) !== value ||
            el.style.getPropertyPriority(prop) !== "important"
        ) {
            el.style.setProperty(prop, value, "important");
        }
    }

    function ensureTabsVisible() {

        var form = getMainRuntimeForm();

        if (!form) {
            return;
        }

        var tabs = form.querySelector(".form-tabs");

        if (!tabs) {
            return;
        }

        setImportant(tabs, "display", "block");
        setImportant(tabs, "visibility", "visible");
        setImportant(tabs, "opacity", "1");
        setImportant(tabs, "height", "auto");
        setImportant(tabs, "min-height", "0");
        setImportant(tabs, "overflow", "visible");

        var tabList = tabs.querySelector(".tab-box-tabs");

        if (tabList) {
            setImportant(tabList, "display", "flex");
            setImportant(tabList, "visibility", "visible");
            setImportant(tabList, "opacity", "1");
            setImportant(tabList, "height", "52px");
            setImportant(tabList, "min-height", "52px");
            setImportant(tabList, "overflow", "visible");
        }

        var tabItems = tabs.querySelectorAll(".tab-box-tabs > li");

        for (var i = 0; i < tabItems.length; i++) {
            setImportant(tabItems[i], "display", "block");
            setImportant(tabItems[i], "visibility", "visible");
            setImportant(tabItems[i], "opacity", "1");
        }

        var tabLinks = tabs.querySelectorAll(".tab-box-tabs > li > a.tab");

        for (var j = 0; j < tabLinks.length; j++) {
            setImportant(tabLinks[j], "display", "flex");
            setImportant(tabLinks[j], "visibility", "visible");
            setImportant(tabLinks[j], "opacity", "1");
        }
    }

    function moveHeaders() {
        var form = getMainRuntimeForm();

        if (!form) {
            return false;
        }

        var tabs = form.querySelector(".form-tabs");

        if (!tabs) {
            return false;
        }

        var globalHeader = getGlobalHeaderRow();
        var customerHeader = getCustomerHeaderRow();

        if (!globalHeader || !customerHeader) {
            return false;
        }

        globalHeader.classList.add(
            "retal-global-header-row"
        );

        customerHeader.classList.add(
            "retal-customer-header-row"
        );

        if (globalHeader.parentNode !== form) {
            form.insertBefore(
                globalHeader,
                tabs
            );
        }

        if (customerHeader.parentNode !== form) {
            form.insertBefore(
                customerHeader,
                tabs
            );
        }

        if (globalHeader.nextElementSibling !== customerHeader) {
            form.insertBefore(
                globalHeader,
                customerHeader
            );
        }

        if (customerHeader.nextElementSibling !== tabs) {
            form.insertBefore(
                customerHeader,
                tabs
            );
        }

        return true;
    }

    function getDirectCells(table) {
        var cells = [];

        for (var i = 0; i < table.children.length; i++) {
            var child = table.children[i];

            if (
                child.classList &&
                child.classList.contains("editor-cell")
            ) {
                cells.push(child);
            }
        }

        return cells;
    }

    function classifyProgress() {
        var form = getMainRuntimeForm();

        if (!form) {
            return;
        }

        var controls = form.querySelectorAll(
            ".SourceCode-Forms-Controls-Web-ControlPack-ProgressControl"
        );

        for (var i = 0; i < controls.length; i++) {
            var control = controls[i];

            var panel = control.closest(".panel");

            if (!panel) {
                continue;
            }

            panel.classList.add("progress-view");

            var table = control.closest(
                ".Grid-Layout.root-table"
            );

            if (!table) {
                continue;
            }

            table.classList.add("progress-table");

            var cells = getDirectCells(table);

            if (cells.length >= 4) {

                cells[0].classList.add(
                    "progress-title-cell"
                );

                cells[1].classList.add(
                    "progress-description-cell"
                );

                var progressHost = control.closest(
                    ".editor-cell"
                );

                if (progressHost) {
                    progressHost.classList.add(
                        "progress-host"
                    );
                }

                cells[3].classList.add(
                    "progress-status-cell"
                );
            }
        }
    }

    function classifyDetailTables() {
        var form = getMainRuntimeForm();

        if (!form) {
            return;
        }

        var tables = form.querySelectorAll(
            ".SourceCode-Forms-Controls-Web-Table.Grid-Layout"
        );

        for (var i = 0; i < tables.length; i++) {

            var table = tables[i];

            // PERF: already classified - skip the per-table subtree queries.
            if (table.hasAttribute("data-cj-detail")) {
                continue;
            }

            if (
                table.querySelector(
                    ".SourceCode-Forms-Controls-Web-ControlPack-ProgressControl"
                )
            ) {
                continue;
            }

            if (
                table.classList.contains(
                    "progress-table"
                )
            ) {
                continue;
            }

            if (
                table.closest(".grid")
            ) {
                continue;
            }

            if (
                table.classList.contains(
                    "retal-custom-header-layout"
                )
            ) {
                continue;
            }

            var cells = getDirectCells(table);

            if (cells.length < 5) {
                continue;
            }

            var labels = table.querySelectorAll(
                ":scope > .editor-cell .SFC.SourceCode-Forms-Controls-Web-Label"
            );

            var dataLabels = table.querySelectorAll(
                ":scope > .editor-cell .SFC.SourceCode-Forms-Controls-Web-DataLabel"
            );

            if (
                labels.length >= 2 &&
                dataLabels.length >= 1
            ) {

                table.classList.add(
                    "detail-table"
                );

                table.setAttribute("data-cj-detail", "1");

                var panel = table.closest(
                    ".panel"
                );

                if (
                    panel &&
                    !panel.classList.contains(
                        "progress-view"
                    )
                ) {
                    panel.classList.add(
                        "detail-view"
                    );
                }
            }
        }

        var rows = form.querySelectorAll(
            ".form > .row"
        );

        for (var r = 0; r < rows.length; r++) {

            var detailViews = rows[r].querySelectorAll(
                ":scope > .view > .detail-view"
            );

            if (detailViews.length >= 2) {

                rows[r].classList.add(
                    "detail-view-row"
                );

            } else if (
                detailViews.length === 1
            ) {

                var directViews = rows[r].querySelectorAll(
                    ":scope > .view"
                );

                if (directViews.length === 1) {

                    detailViews[0].classList.add(
                        "single-detail-view"
                    );
                }
            }
        }
    }

    // PERF: was getComputedStyle + getBoundingClientRect per popup (forced
    // synchronous layout on every DOM mutation). getClientRects().length is 0
    // for display:none elements and offsetWidth/Height cover zero-size cases.
    function isVisible(el) {
        if (!el || !el.getClientRects().length) {
            return false;
        }
        if (el.offsetWidth === 0 || el.offsetHeight === 0) {
            return false;
        }
        return window.getComputedStyle(el).visibility !== "hidden";
    }

    function isPopupOpen() {

        var popups = document.querySelectorAll(".popup.dialog");

        for (var i = 0; i < popups.length; i++) {
            if (popups[i].closest(".main-customer-form")) {
                continue;
            }
            if (isVisible(popups[i])) {
                return true;
            }
        }

        var iframes = document.querySelectorAll("iframe.runtime-popup");

        for (var j = 0; j < iframes.length; j++) {
            var parent = iframes[j].closest(".popup");
            if (parent && isVisible(parent)) {
                return true;
            }
        }

        return false;
    }

    function updatePopupState() {

        var form = getMainRuntimeForm();

        if (!form) {
            return;
        }

        var open = isPopupOpen();

        if (form.classList.contains("cj-popup-open") !== open) {
            form.classList.toggle("cj-popup-open", open);
        }
    }

    function initialise() {
        var form = markMainForm();

        if (!form) {
            return;
        }

        // PERF: popup check (a layout read) happens BEFORE any style writes,
        // so the browser is not forced into a synchronous reflow mid-pass.
        updatePopupState();

        moveHeaders();

        ensureTabsVisible();
        classifyProgress();
        classifyDetailTables();
    }

    // PERF: was called synchronously for every mutation batch AND every 200 ms
    // (100 times). Now coalesced: at most one pass per 100 ms burst.
    var pending = null;

    function schedule() {
        if (pending) {
            return;
        }
        pending = setTimeout(function () {
            pending = null;
            initialise();
        }, 100);
    }

    function start() {

        initialise();

        if (window.MutationObserver) {

            // childList only - attribute/style changes made by this script
            // do not re-trigger it. Kept alive (cheap when debounced) so the
            // popup state also works for popups opened after 30 s.
            new MutationObserver(schedule).observe(document.body, {
                childList: true,
                subtree: true
            });

        } else {
            // Legacy fallback: a few delayed passes instead of 100 polls.
            setTimeout(initialise, 500);
            setTimeout(initialise, 1500);
            setTimeout(initialise, 4000);
        }
    }

    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {

        setTimeout(
            start,
            300
        );

    } else {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                setTimeout(
                    start,
                    300
                );

            }
        );
    }

})();
