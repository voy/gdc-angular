/*global Utils */

var RedirectToProjectCntl = function($scope, $location, bootstrap) {
    bootstrap().done(function(res) {
        var currentProjectUrl = res.profileSetting.currentProjectUri;
        $location.path(Utils.url2id(currentProjectUrl)+'/dashboard');
    }.withScope($scope));
};


var ProfileCntl = function($scope, $location, bootstrap, logout) {
    $scope.authenticated = false;

    bootstrap().done(function(res) {
        var account = res.accountSetting;
        $scope.name = account.firstName + ' ' + account.lastName;
        $scope.login = account.login;
        $scope.authenticated = true;
    }.withScope($scope));

    $scope.logout = function() {
        logout().done(function() {
            $scope.authenticated = false;
            delete $scope.name;
            delete $scope.login;
            $location.path('/login');
        }.withScope($scope));
    };
};

var ProjectsCntl = function($scope, $rootScope, $location, $routeParams, projects) {
    $scope.projects = [];

    function refreshCurrentProject() {
        for (var i = 0; i < $scope.projects.length; i++) {
            var project = $scope.projects[i];
            if (project.id === $routeParams.projectId) {
                $scope.currentProject = project;
                break;
            }
        }
    }

    projects().done(function(res) {
        res = res.map(function(p) {
            return {
                id: Utils.url2id(p.links.self),
                url: p.links.self,
                title: p.meta.title
            };
        });

        $scope.projects = res;
        refreshCurrentProject();
    }.withScope($scope));

    $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
        //controller is outside ngView and it is not recreated on route change
        refreshCurrentProject();
    });

    $scope.switchProject = function() {
        $location.path('/'+$scope.currentProject.id+'/dashboard');
    };
};

var LoginCntl = function($scope, $location, login) {
    $scope.username = 'bear@gooddata.com';
    $scope.login = function() {
        delete $scope.message;
        login($scope.username, $scope.password).done(function() {
            $location.path('/');
        }.withScope($scope)).fail(function() {
            $scope.message = '-------------Invalid-------------';
        }.withScope($scope));
    };
};