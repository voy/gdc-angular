/*global Utils */

var RedirectToProjectCntl = function($scope, $location, bootstrap) {
    bootstrap().done(function(res) {
        var currentProjectUrl = res.profileSetting.currentProjectUri;
        $location.path(Utils.url2id(currentProjectUrl)+'/dashboard');
    }.withScope($scope));
};


var ProfileCntl = function($scope, $rootScope, $location, bootstrap, logout) {
    $scope.authenticated = false;

    function refreshUser() {
        bootstrap().done(function(res) {
            var account = res.accountSetting;
            $scope.name = account.firstName + ' ' + account.lastName;
            $scope.login = account.login;
            $scope.authenticated = true;
        }.withScope($scope));
    }

    refreshUser();

    $scope.logout = function() {
        logout().done(function() {
            $scope.authenticated = false;
            delete $scope.name;
            delete $scope.login;
            $rootScope.$broadcast('logoutSuccess');
            $location.path('/login');
        }.withScope($scope)).fail(function() {
            //e.g. already logged out
            $location.path('/login');
        }.withScope($scope));
    };

    //Profile controller is outsidr ng-view, so nobody refresh user data automatically
    $scope.$on('loginSuccess', function() {
        refreshUser();
    });
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

    function refreshProjects() {
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
    }

    refreshProjects();

    $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
        //controller is outside ngView and it is not recreated on route change
        refreshCurrentProject();
    });

    $scope.$on('loginSuccess', function() {
        refreshProjects();
    });
    $scope.$on('logoutSuccess', function() {
        $scope.projects = [];
    });

    $scope.switchProject = function() {
        $location.path('/'+$scope.currentProject.id+'/dashboard');
    };
};

var LoginCntl = function($scope, $rootScope, $location, login) {
    $scope.username = 'bear@gooddata.com';

    $scope.login = function() {
        delete $scope.message;
        login($scope.username, $scope.password).done(function() {
            $rootScope.$broadcast('loginSuccess');
            $location.path('/');
        }.withScope($scope)).fail(function() {
            $scope.message = '-------------Invalid-------------';
        }.withScope($scope));
    };
};