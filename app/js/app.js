/*jshint undef:false */


var LOADING_TEMPLATE = '<p class="loading">Loading...</p>';

angular.module('gdAngular', ['gdXhr', 'gdRestApi', 'gdDashboardViews', 'gdReportItemView']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', { template: LOADING_TEMPLATE, controller: RedirectToProjectCntl}).

            when('/login', { templateUrl: 'partials/login.html', controller: LoginCntl}).

            when('/:projectId/dashboard', { template: LOADING_TEMPLATE, controller: RedirectToFirstDasboardCntl}).
            when('/:projectId/dashboard/default', { template: 'Only empty default dashboard exists.'}).
            when('/:projectId/dashboard/:dashboardId', { template: LOADING_TEMPLATE, controller: RedirectToFirstTabCntl}).
            when('/:projectId/dashboard/:dashboardId/:tabId', { templateUrl: 'partials/dashboard/view.html', controller: ViewDashboardCntl}).

            when('/:projectId/reports', { templateUrl: 'partials/reports.html'}).

            otherwise({ redirectTo: '/' });
    }]);

    // filter('url2id', function() {
    //     return function(value) {
    //         return Utils.url2id(value);
    //     };
    // }).

