'use strict';
define(function(require) {
    return function cleanTextArea() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elem, attrs, ngModelCtrl) {
                elem.on('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                });
                
                elem.on('blur', function() {
                    const raw = elem.val();
                    const clean = raw
                        .replace(/"/g, '')
                        .replace(/\s+/g, ' ');
                    if (clean !== raw) {
                        elem.val(clean);
                        if (ngModelCtrl) {
                            scope.$applyAsync(() => {
                                ngModelCtrl.$setViewValue(clean);
                            });
                        }
                    }
                });
            }
        };
    };
});