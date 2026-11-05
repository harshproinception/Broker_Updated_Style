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
