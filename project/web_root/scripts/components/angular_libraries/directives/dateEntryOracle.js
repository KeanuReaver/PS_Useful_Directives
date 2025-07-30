'use strict';
define(function(require) {
    const $j = require('jquery');

    return function dateEntryOracle() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                const outputFormat = attrs.dateEntryOutput || element.attr('data-date-entry-output') || 'oracle';

                // Inject style once
                (function injectStyles() {
                    if (document.getElementById('ucsdDateEntry-style')) return;
                    const style = document.createElement('style');
                    style.id = 'ucsdDateEntry-style';
                    style.textContent = `
                        input[data-date-entry-oracle] {
                            padding-left: 28px !important;
                            background-image: url("/scripts/markitup/sets/html/images/icon-calendar.png") !important;
                            background-repeat: no-repeat !important;
                            background-position: 6px center !important;
                            background-size: 16px 16px !important;
                            box-sizing: border-box !important;
                            width: auto !important;
                            cursor: pointer;
                        }
                    `;
                    document.head.appendChild(style);
                })();

                // Format date for display: always MM/dd/yyyy
                ngModel.$formatters.push(function(value) {
                    if (!value) return '';

                    // Normalize input: extract date part
                    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
                    if (match) {
                        const [, yyyy, mm, dd] = match;
                        return `${mm}/${dd}/${yyyy}`;
                    }

                    // Try to parse MM/dd/yyyy input
                    const alt = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                    if (alt) {
                        return `${alt[1].padStart(2, '0')}/${alt[2].padStart(2, '0')}/${alt[3]}`;
                    }

                    return value; // fallback
                });

                // Format for saving
                ngModel.$parsers.push(function(value) {
                    if (!value) return '';

                    const parts = value.trim().split('/');
                    if (parts.length !== 3) return ngModel.$modelValue;

                    const [mm, dd, yyyy] = parts;
                    if (outputFormat === 'psq') {
                        return `${mm.padStart(2, '0')}/${dd.padStart(2, '0')}/${yyyy}`;
                    } else {
                        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
                    }
                });

                // Add jQuery UI datepicker
                $j(element).datepicker({
                    dateFormat: 'mm/dd/yy',
                    onSelect: function(dateText) {
                        ngModel.$setViewValue(dateText);
                        ngModel.$render();
                    }
                });

                // Optional: arrow key day adjust
                element.on('keydown', function(event) {
                    const viewValue = element.val();
                    const m = viewValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                    if (!m) return;

                    let [ , mm, dd, yyyy ] = m.map(s => parseInt(s, 10));
                    const date = new Date(yyyy, mm - 1, dd);
                    if (isNaN(date)) return;

                    if (event.key === 'ArrowUp') {
                        date.setDate(date.getDate() + 1);
                    } else if (event.key === 'ArrowDown') {
                        date.setDate(date.getDate() - 1);
                    } else {
                        return;
                    }

                    const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
                    ngModel.$setViewValue(formatted);
                    ngModel.$render();
                    event.preventDefault();
                });

                element.addClass('ucsdDateEntry');
            }
        };
    };
});