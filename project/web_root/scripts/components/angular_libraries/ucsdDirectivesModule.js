'use strict';
define([
    'angular',
    'components/angular_libraries/directives/ucsdToolTips',
    'components/angular_libraries/directives/timeEntrySeconds',
    'components/angular_libraries/directives/dateEntryOracle',
    'components/angular_libraries/directives/cleanTextArea',
    'components/angular_libraries/services/psQueryFactory'
], function(angular, ucsdToolTips, timeEntrySeconds, dateEntryOracle, cleanTextArea) {
    return angular.module('ucsdDirectives', ['psQueryModule'])
        .directive('tooltipFollow', ucsdToolTips)
        .directive('timeEntrySeconds', timeEntrySeconds)
        .directive('dateEntryOracle', dateEntryOracle)
        .directive('cleanTextArea', cleanTextArea);
});