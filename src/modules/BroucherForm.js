(function () {
    "use strict";

    function applyRetalBrochureClasses() {
        var marker = document.querySelector('span[name="Broucher_Style_dlb"]');
        if (!marker) return false;

        var form = marker.closest('.runtime-form');
        if (!form) return false;

        form.classList.add('pi-has-brochure-form');

        var headerTable = form.querySelector(
            '.panel[name="RetalCatalogue.Form Area Item"] .root-table[name="Table"]'
        );

        if (headerTable) {
            headerTable.classList.add('retal-brochure-header-layout');
        }

        var catalogue = form.querySelector(
            '.panel[name="RetalCatalogue.Form Area Item1"] .root-table[name="Table"]'
        );

        if (!catalogue) return false;

        catalogue.classList.add('retal-project-catalogue-grid');

        var imageLabels = catalogue.querySelectorAll(
            '[name="Edwansedara_phase4_img"], ' +
            '[name="Edwansedara_phase5_img"], ' +
            '[name="Ayalasedara_img"], ' +
            '[name="RoyaSedaraCompound_img"], ' +
            '[name="RejanHillsCompound_img"], ' +
            '[name="ayalaalmohammadiyah_img"], ' +
            '[name="Noburesidences_img"], ' +
            '[name="Retalrise_img"]'
        );

        for (var i = 0; i < imageLabels.length; i++) {
            var imageLabel = imageLabels[i];

            imageLabel.classList.add('retal-project-image');

            var card = imageLabel.closest('.editor-cell');

            if (card) {
                card.classList.add('retal-project-card');
            }
        }

        var sectionNames = [
            'Riyadh_projects',
            'Jrddah_projects',
            'Alkhobarprojects'
        ];

        for (var j = 0; j < sectionNames.length; j++) {
            var sectionLabel = catalogue.querySelector(
                '[name="' + sectionNames[j] + '"]'
            );

            if (sectionLabel) {
                var sectionCell = sectionLabel.closest('.editor-cell');

                if (sectionCell) {
                    sectionCell.classList.add('retal-project-section-heading');
                }
            }
        }

        return true;
    }

    function initialize() {
        if (applyRetalBrochureClasses()) return;

        if (!document.body || typeof MutationObserver === 'undefined') return;

        var observer = new MutationObserver(function () {
            if (applyRetalBrochureClasses()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, {
            once: true
        });
    } else {
        initialize();
    }
})();
