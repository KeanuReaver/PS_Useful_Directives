'use strict';
define(function(require) {
    const $j = require('jquery');

    return function dateEntryOracle() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                const outputFormat = attrs.dateEntryOutput || element.attr('data-date-entry-output') || 'oracle';
                const pivot = Number(attrs.dateEntryPivot || element.attr('data-date-entry-pivot') || 70);

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

                function toFourDigitYear(yy) {
                    const n = Number(yy);
                    if (yy.length === 4) return n;
                    return n <= pivot ? 2000 + n : 1900 + n;
                }

                // Parse string into { yyyy, mm, dd } or null
                function parseAnyDateString(s) {
                    if (!s) return null;
                    const str = String(s).trim();

                    // ISO-ish: 2024-08-05 or 2024-08-05T...
                    let m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
                    if (m) {
                        const [, yyyy, mm, dd] = m;
                        return { yyyy: Number(yyyy), mm: Number(mm), dd: Number(dd) };
                    }

                    // Flexible: M/D/YYYY, M-D-YYYY, MM-dd-yy, etc.
                    m = str.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2}|\d{4})$/);
                    if (m) {
                        let [, mm, dd, y] = m;
                        const yyyy = toFourDigitYear(y);
                        return { yyyy, mm: Number(mm), dd: Number(dd) };
                    }

                    return null;
                }

                function toDisplay({ yyyy, mm, dd }) {
                    return `${String(mm).padStart(2, '0')}/${String(dd).padStart(2, '0')}/${String(yyyy)}`;
                }

                // Display in input: always MM/DD/YYYY
                ngModel.$formatters.push(function(value) {
                    if (!value) return '';
                    const parsed = parseAnyDateString(value);
                    return parsed ? toDisplay(parsed) : String(value);
                });

                // Save to model: oracle (YYYY-MM-DD) or psq (MM/DD/YYYY)
                ngModel.$parsers.push(function(value) {
                    if (!value) return '';
                    const parsed = parseAnyDateString(value);
                    if (!parsed) return ngModel.$modelValue;

                    const { yyyy, mm, dd } = parsed;
                    if (outputFormat === 'psq') {
                        return `${String(mm).padStart(2, '0')}/${String(dd).padStart(2, '0')}/${yyyy}`;
                    } else {
                        return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
                    }
                });

                // jQuery UI datepicker
                $j(element).datepicker({
                    dateFormat: 'mm/dd/yy', // jQuery UI: 'yy' is 4-digit year
                    onSelect: function(dateText) {
                        ngModel.$setViewValue(dateText);
                        ngModel.$render();
                    }
                });

                element.on('keydown', function(event) {
                    const viewValue = element.val();
                    const p = parseAnyDateString(viewValue);
                    if (!p) return;

                    const date = new Date(p.yyyy, p.mm - 1, p.dd);
                    if (isNaN(date)) return;

                    if (event.key === 'ArrowUp') {
                        date.setDate(date.getDate() + 1);
                    } else if (event.key === 'ArrowDown') {
                        date.setDate(date.getDate() - 1);
                    } else {
                        return;
                    }

                    const formatted = toDisplay({
                        yyyy: date.getFullYear(),
                        mm: date.getMonth() + 1,
                        dd: date.getDate()
                    });
                    ngModel.$setViewValue(formatted);
                    ngModel.$render();
                    event.preventDefault();
                });

                element.addClass('ucsdDateEntry');
            }
        };
    };
});