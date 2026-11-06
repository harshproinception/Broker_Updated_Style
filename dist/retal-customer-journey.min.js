/* ===== BEGIN Global.js ===== */
/* =========================================================================
   1. MARKERS ENGINE: Automatically adds .pi-has-* to parent ancestors
   ========================================================================= */
(function () {
    var MARKERS = [
        ["[name=\"Add_cust_style_dlb\"]", "pi-has-add-cust"],
        ["span[name=\"Projects_tab_List_dlb\"]", "pi-has-projects-list"],
        ["span[name=\"MyCustomer_List_Style_dlb\"]", "pi-has-mycust-list"],
        ["span[name=\"Ops_cards_style_dlb\"]", "pi-has-ops-cards"],
        ["span[name=\"card_style_dlb\"]", "pi-has-card-style"],
        ["[name=\"CustomerLeadDetailsStyleDlb\"]", "pi-has-cld-style"],
        ["a[name=\"Home btn\"]", "pi-has-home-btn"],
        [".retal-custom-header-layout", "pi-has-header-layout"],
        ["span[name=\"space_style_dlb\"]", "pi-has-space-style"],
        ["[name=\"header_name_label\"]", "pi-has-header-name"],
        ["[name=\"Header_style_dbl\"]", "pi-has-header-style"],
        ["[name=\"PortalSelectionStyleDlb\"]", "pi-has-portal-selection"]
    ];

    function sync() {
        for (var m = 0; m < MARKERS.length; m++) {
            var sel = MARKERS[m][0];
            var cls = MARKERS[m][1];
            var want = [];
            var nodes = document.querySelectorAll(sel);

            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i].parentElement;
                while (el && want.indexOf(el) === -1) {
                    want.push(el);
                    el = el.parentElement;
                }
            }

            for (var a = 0; a < want.length; a++) {
                if (!want[a].classList.contains(cls)) {
                    want[a].classList.add(cls);
                }
            }

            var stale = document.getElementsByClassName(cls);
            for (var s = stale.length - 1; s >= 0; s--) {
                if (want.indexOf(stale[s]) === -1) {
                    stale[s].classList.remove(cls);
                }
            }
        }
    }

    window.piSyncPageMarkers = sync;
    sync();

    if (window.MutationObserver) {
        new MutationObserver(sync).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
})();

/* =========================================================================
   2. SIDEBAR & GLOBAL LAYOUT INITIALIZER
   ========================================================================= */
function getRetalSidebarRow() {
    return $('.form a[name="Home btn"]').first().closest('.row');
}

function initializeRetalGlobalLayout() {
    var $headerTarget = $('span[name="Header_style_dbl"]').closest('div.Grid-Layout.root-table');
    if ($headerTarget.length === 0) {
        $headerTarget = $('.form .row:first-child .root-table');
    }

    if ($headerTarget.length && !$headerTarget.hasClass('retal-custom-header-layout')) {
        $headerTarget.addClass('retal-custom-header-layout');
        if (window.piSyncPageMarkers) {
            window.piSyncPageMarkers();
        }
    }

    var $sidebarRow = getRetalSidebarRow();
    if (!$sidebarRow.length) {
        return;
    }

    var $buttons = $sidebarRow.find('a.SourceCode-Forms-Controls-Web-Button');

    if ($buttons.length) {
        var currentUrl = window.location.href.toLowerCase();
        var activeButtonName = "Home btn";

        if (currentUrl.indexOf("opsteam.customerdetail.form") !== -1) {
            activeButtonName = null;
        }
        else if (currentUrl.indexOf("customer") !== -1 && currentUrl.indexOf("add") !== -1) {
            activeButtonName = "Add custm btn";
        } else if (currentUrl.indexOf("projects") !== -1 || currentUrl.indexOf("customerjourney.selectedbroker.form") !== -1) {
            activeButtonName = "Project btn";
        } else if (currentUrl.indexOf("configuration") !== -1) {
            activeButtonName = "Configuration btn";
        } else if (currentUrl.indexOf("worklist") !== -1) {
            activeButtonName = "Worklist btn";
        } else if (currentUrl.indexOf("mycustomerslead") !== -1) {
            activeButtonName = "My cust lead btn";
        } else if ((currentUrl.indexOf("my") !== -1 && currentUrl.indexOf("customer") !== -1) ||
            (currentUrl.indexOf("all") !== -1 && currentUrl.indexOf("customer") !== -1) ||
            (currentUrl.indexOf("customerdetailsrega") !== -1) ||
            (currentUrl.indexOf("brokercustomerdetails") !== -1)) {
            activeButtonName = "My custm btn";
        }

        $buttons.removeClass('active-nav');
        if (activeButtonName) {
            $sidebarRow.find('a[name="' + activeButtonName + '"]').addClass('active-nav');
        }
    }
}

(function () {
    var ajaxTimer = null;

    $(document).ready(function () {
        initializeRetalGlobalLayout();

        $(document).on('click', '.form a.SourceCode-Forms-Controls-Web-Button', function () {
            var $row = $(this).closest('.row');
            if (!$row.find('a[name="Home btn"]').length) {
                return;
            }

            // Only change the active states IF the clicked button is NOT "Retal_Cat_Btn"
            if ($(this).attr('name') !== 'Retal_Cat_Btn') {
                $row.find('a.SourceCode-Forms-Controls-Web-Button').removeClass('active-nav');
                $(this).addClass('active-nav');
            }
        });
    });

    $(document).ajaxComplete(function () {
        clearTimeout(ajaxTimer);
        ajaxTimer = setTimeout(initializeRetalGlobalLayout, 100);
    });
})();

// Adding this function for custom adding of class for the inconsistent views which are made in grid layout
// $(document).ready(function () {
//     function applyDetailTableClass() {
//         $('[name="project_may_broker_lbl"]').each(function () {
//             $(this)
//                 .closest('.Grid-Layout')
//                 .addClass('detail-table');
//         });
//     }
//     applyDetailTableClass();
//     var observer = new MutationObserver(function () {
//         applyDetailTableClass();
//     });
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
// });
$(document).ready(function () {
    function applyDetailTableClass() {
        var nodes = document.querySelectorAll('[name="project_may_broker_lbl"]');
        for (var i = 0; i < nodes.length; i++) {
            var grid = nodes[i].closest('.Grid-Layout');
            if (grid && !grid.classList.contains('detail-table')) {
                grid.classList.add('detail-table');
            }
        }
    }

    applyDetailTableClass();

    if (window.MutationObserver) {
        var domTimer = null;
        new MutationObserver(function () {
            if (domTimer) return;
            domTimer = setTimeout(function () {
                domTimer = null;
                applyDetailTableClass();
            }, 150); // Batches multiple mutations into a single execution
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});
/* ===== END Global.js ===== */


/* ===== BEGIN Card.js ===== */
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
/* ===== END Card.js ===== */


/* ===== BEGIN CustomerLeadDetails.js ===== */
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
/* ===== END CustomerLeadDetails.js ===== */


/* ===== BEGIN Translation.js ===== */
// (function () {
//     "use strict";

//     var config = {
//         containerId: "google_translate_element",
//         scriptId: "google_translate_script",
//         arabicButton: '[name="btnArabic"]',
//         englishButton: '[name="btnEnglish"]',
//         retryCount: 0,
//         maxRetries: 20
//     };

//     var state = {
//         initialized: false,
//         googleLoaded: false,
//         clickBound: false,
//         observer: null,
//         observerTimer: null,
//         applyingLayout: false
//     };

//     function createGoogleContainer() {
//         if (document.getElementById(config.containerId)) return;

//         var div = document.createElement("div");
//         div.id = config.containerId;
//         div.style.display = "none";
//         document.body.appendChild(div);
//     }

//     function initGoogleTranslate() {
//         if (state.googleLoaded) return;

//         createGoogleContainer();

//         if (document.getElementById(config.scriptId)) return;

//         window.googleTranslateElementInit = function () {
//             if (
//                 typeof google === "undefined" ||
//                 !google.translate ||
//                 !google.translate.TranslateElement
//             ) return;

//             try {
//                 new google.translate.TranslateElement({
//                     pageLanguage: "en",
//                     includedLanguages: "ar",
//                     autoDisplay: false
//                 }, config.containerId);

//                 state.googleLoaded = true;

//                 setTimeout(applyLanguageLayout, 500);
//             } catch (error) {
//                 console.error("[Translation] Initialization failed:", error);
//             }
//         };

//         var script = document.createElement("script");
//         script.id = config.scriptId;
//         script.src =
//             "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//         script.async = true;

//         script.onerror = function () {
//             console.error("[Translation] Failed to load Google Translate.");
//         };

//         document.body.appendChild(script);
//     }

//     function getGoogleSelector() {
//         return document.querySelector(".goog-te-combo");
//     }

//     window.translateToArabic = function () {
//         // 1. Start loading the Google Translate script
//         initGoogleTranslate();

//         // 2. Wait for the dropdown AND its options to exist
//         function checkAndTranslate() {
//             var combo = getGoogleSelector();

//             // FIX: Ensure combo exists AND Google has finished populating it with languages
//             if (combo && combo.options && combo.options.length > 0) {

//                 config.retryCount = 0;

//                 try {
//                     combo.value = "ar";
//                     combo.dispatchEvent(new Event("change", { bubbles: true }));

//                     setTimeout(applyLanguageLayout, 800);
//                 } catch (error) {
//                     console.error("[Translation] Arabic translation failed:", error);
//                 }
//             } else {
//                 // Not ready yet, keep checking every 200ms
//                 if (config.retryCount < 30) { // Increased to 30 (6 seconds) to be safe on slow networks
//                     config.retryCount++;
//                     setTimeout(checkAndTranslate, 200);
//                 } else {
//                     config.retryCount = 0;
//                     console.error("[Translation] Google Translate options did not load in time.");
//                 }
//             }
//         }

//         // 3. Start the checking process
//         checkAndTranslate();
//     };

//     function clearTranslationCookie() {
//         var host = location.hostname;
//         var domain = host.split(".").length > 2
//             ? "." + host.split(".").slice(-2).join(".")
//             : host;

//         document.cookie =
//             "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

//         document.cookie =
//             "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + host;

//         document.cookie =
//             "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
//     }

//     window.translateToEnglish = function () {
//         clearTranslationCookie();

//         document.documentElement.classList.remove(
//             "translated-rtl",
//             "translated-ltr"
//         );

//         document.body.classList.remove(
//             "translated-rtl",
//             "translated-ltr"
//         );

//         document.documentElement.style.direction = "ltr";
//         document.body.style.setProperty("direction", "ltr", "important");
//         document.body.style.setProperty("text-align", "left", "important");

//         setTimeout(function () {
//             window.location.reload();
//         }, 100);
//     };

//     function isArabic() {
//         var cookies = decodeURIComponent(document.cookie || "");

//         return (
//             cookies.indexOf("googtrans=/en/ar") !== -1 ||
//             cookies.indexOf("googtrans=/auto/ar") !== -1
//         );
//     }

//     function applyLanguageLayout() {
//         if (state.applyingLayout) return;

//         state.applyingLayout = true;

//         try {
//             var arabic = isArabic();
//             var englishButton = document.querySelector(config.englishButton);
//             var arabicButton = document.querySelector(config.arabicButton);
//             var forms = document.querySelectorAll(".theme-entry .form");

//             document.documentElement.setAttribute(
//                 "dir",
//                 arabic ? "rtl" : "ltr"
//             );

//             document.documentElement.setAttribute(
//                 "lang",
//                 arabic ? "ar" : "en"
//             );

//             document.body.style.setProperty(
//                 "direction",
//                 arabic ? "rtl" : "ltr",
//                 "important"
//             );

//             document.body.style.setProperty(
//                 "text-align",
//                 arabic ? "right" : "left",
//                 "important"
//             );

//             if (arabic) {
//                 if (englishButton) englishButton.classList.remove("hidden");
//                 if (arabicButton) arabicButton.classList.add("hidden");

//                 forms.forEach(function (form) {
//                     form.setAttribute("dir", "rtl");
//                     form.classList.add("customer-journey-rtl");
//                     form.classList.remove("customer-journey-ltr");
//                 });
//             } else {
//                 if (arabicButton) arabicButton.classList.remove("hidden");
//                 if (englishButton) englishButton.classList.add("hidden");

//                 forms.forEach(function (form) {
//                     form.setAttribute("dir", "ltr");
//                     form.classList.add("customer-journey-ltr");
//                     form.classList.remove("customer-journey-rtl");
//                 });
//             }
//         } finally {
//             setTimeout(function () {
//                 state.applyingLayout = false;
//             }, 50);
//         }
//     }

//     function bindLanguageButtons() {
//         if (state.clickBound) return;

//         document.addEventListener("click", function (event) {
//             if (!event.target || !event.target.closest) return;

//             if (event.target.closest(config.arabicButton)) {
//                 event.preventDefault();
//                 window.translateToArabic();
//                 return;
//             }

//             if (event.target.closest(config.englishButton)) {
//                 event.preventDefault();
//                 window.translateToEnglish();
//             }
//         }, true);

//         state.clickBound = true;
//     }

//     function observeK2() {
//         if (
//             typeof MutationObserver === "undefined" ||
//             state.observer
//         ) return;

//         state.observer = new MutationObserver(function (mutations) {
//             if (state.applyingLayout) return;

//             var changed = mutations.some(function (mutation) {
//                 return (
//                     mutation.type === "childList" &&
//                     mutation.addedNodes.length
//                 );
//             });

//             if (!changed) return;

//             clearTimeout(state.observerTimer);

//             state.observerTimer = setTimeout(
//                 applyLanguageLayout,
//                 150
//             );
//         });

//         state.observer.observe(document.body, {
//             childList: true,
//             subtree: true
//         });
//     }

//     function init() {
//         if (state.initialized) return;

//         state.initialized = true;

//         // PERF: only download Google Translate (~external script + widget DOM)
//         // when the page is already in Arabic; otherwise load it on first click.
//         if (isArabic()) {
//             initGoogleTranslate();
//         }
//         bindLanguageButtons();
//         observeK2();

//         setTimeout(applyLanguageLayout, 500);
//     }

//     if (document.readyState === "loading") {
//         document.addEventListener("DOMContentLoaded", init);
//     } else {
//         init();
//     }
// })();
// /* ===== END Translation.js ===== */
