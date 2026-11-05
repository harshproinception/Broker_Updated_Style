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
