'use strict';
define(function() {
    return [function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                const inputFormat = attrs.timeEntryInput || element.attr('data-time-entry-input') || 'seconds';
                const outputFormat = attrs.timeEntryOutput || element.attr('data-time-entry-output') || 'seconds';

                const parseAsString = inputFormat === 'string';
                const saveAsString = outputFormat === 'string';

                // Apply time input field styling
                (function injectTimeEntryStyles() {
                    if (document.getElementById('ucsdTimeEntry-style')) return;
                    const style = document.createElement('style');
                    style.id = 'ucsdTimeEntry-style';
                    style.textContent = `
                        input[data-time-entry-seconds], input[time-entry-seconds] {
                            width: auto !important;
                            background-image: url("/images/img/icon-time.png");
                            background-repeat: no-repeat;
                            background-position: 2px center;
                            background-size: 16px 16px;
                            padding-left: 20px !important;
                        }
                    `;
                    document.head.appendChild(style);
                })();

                function formatSeconds(seconds) {
                    if (seconds == null || isNaN(seconds)) return '';
                    let hours = Math.floor(seconds / 3600);
                    let minutes = Math.floor((seconds % 3600) / 60);
                    const ampm = (hours >= 12) ? 'PM' : 'AM';
                    hours = hours % 12;
                    if (hours === 0) hours = 12;
                    return (
                        String(hours).padStart(2, '0') +
                        ':' +
                        String(minutes).padStart(2, '0') +
                        ' ' +
                        ampm
                    );
                }

                function stringToSeconds(str) {
                    if (!str) return 28800;
                    const m = String(str).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
                    if (!m) return NaN;
                    let h = parseInt(m[1], 10);
                    const mins = parseInt(m[2], 10);
                    const ampm = m[3].toUpperCase();
                    if (h < 1 || h > 12 || mins < 0 || mins > 59) return NaN;
                    if (ampm === 'PM' && h !== 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;
                    return h * 3600 + mins * 60;
                }

                function format(modelValue) {
                    if (modelValue == null || modelValue === '') return '';
                
                    const looksLikeString = typeof modelValue === 'string' && /[ap]m$/i.test(modelValue.trim());
                    const seconds = looksLikeString
                        ? stringToSeconds(modelValue)
                        : parseInt(modelValue, 10);
                
                    return formatSeconds(seconds);
                }

                function parse(viewValue) {
                    if (!viewValue) return saveAsString ? '' : undefined;
                    const seconds = stringToSeconds(viewValue);
                    return saveAsString ? formatSeconds(seconds) : seconds;
                }

                function adjustTime(bySeconds) {
                    const currentText = element.val();
                    const seconds = stringToSeconds(currentText);
                    const adjustedSeconds = Math.max(0, Math.min(86399, isNaN(seconds) ? 28800 : seconds + bySeconds));
                    const newDisplay = formatSeconds(adjustedSeconds);

                    scope.$applyAsync(() => {
                        const newModelValue = saveAsString ? newDisplay : adjustedSeconds;
                        ngModel.$setViewValue(newModelValue);
                        element.val(newDisplay);
                    });
                }

                ngModel.$parsers.push(function(viewValue) {
                    const parsed = parse(viewValue);
                    ngModel.$setValidity('timeEntrySeconds', parsed != null);
                    return parsed;
                });

                ngModel.$formatters.push(function(modelValue) {
                    return format(modelValue);
                });

                element.on('blur', function() {
                    scope.$applyAsync(() => {
                        const finalModel = ngModel.$modelValue;
                        element.val(format(finalModel));
                    });
                });

                element.on('keydown', function(e) {
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        adjustTime(300);
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        adjustTime(-300);
                    }
                });

                element.on('wheel', function(e) {
                    if (document.activeElement !== element[0]) return;
                    e.preventDefault();
                    adjustTime(e.originalEvent.deltaY < 0 ? 300 : -300);
                });
            }
        };
    }];
});