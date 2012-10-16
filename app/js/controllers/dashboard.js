/*global Utils */

var SelectDashboardCntl = function($scope, $location, $routeParams, dashboards) {
    dashboards($routeParams.projectId).done(function(res) {
        res = res.entries.map(function(d) {
            return {
                id:  Utils.url2id(d.link),
                url: d.link,
                title: d.title
            };
        });
        $scope.dashboards = res;
    }.withScope($scope));

    $scope.openDashboard = function(d) {
        $location.path('/'+$routeParams.projectId + '/dashboard/' + d.id);
    };
};

var RedirectToFirstDasboardCntl = function($scope, $location, $routeParams, dashboards) {
    dashboards($routeParams.projectId).done(function(res) {
        if (res.entries.length) {
            var dashboardId = Utils.url2id(res.entries[0].link);
            $location.path('/'+$routeParams.projectId + '/dashboard/' + dashboardId);
        } else {
            $location.path('/'+$routeParams.projectId + '/dashboard/default');
        }
    }.withScope($scope));
};

var RedirectToFirstTabCntl = function($scope, $location, $routeParams, dashboardView) {
    dashboardView($routeParams.projectId, $routeParams.dashboardId).done(function(res) {
        var tabId = res.content.tabs[0].identifier;
        $location.path('/'+$routeParams.projectId + '/dashboard/' + $routeParams.dashboardId + '/' + tabId);
    }.withScope($scope));
};

var ViewDashboardCntl = function($scope, $location, $routeParams, dashboardView) {
    dashboardView($routeParams.projectId, $routeParams.dashboardId).done(function(res) {
        var currentTabItems,
            tabs = res.content.tabs.map(function(tab) {
                if (tab.identifier === $routeParams.tabId) {
                    currentTabItems = tab.items;
                }
                return {
                    id: tab.identifier,
                    title: tab.title
                };
            });

        //$scope.filters = res.content.filters;
        $scope.tabs = tabs;
        $scope.items = currentTabItems;
    }.withScope($scope));

    $scope.openTab = function(tab) {
        $location.path('/'+$routeParams.projectId + '/dashboard/' + $routeParams.dashboardId + '/' + tab.id);
    };
};

