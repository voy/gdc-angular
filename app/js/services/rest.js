/*global Utils */

angular.module('gdRestApi', ['gdDataStore']).
    factory('login', function(ds) {
        return function(username, password) {
            return $._ajax('/gdc/account/login', {
                type: 'post',
                data: JSON.stringify({ postUserLogin: { login: username, password: password, remember: 1}})
            }).pipe(function(data) {
                ds.clear();
                return $._ajax('/gdc/account/token/');
            });
        };
    }).
    factory('logout', function(ds, bootstrap) {
        return function() {
            return bootstrap().pipe(function(bootstrapResource) {
                var profileId = Utils.url2id(bootstrapResource.accountSetting.links.self);
                return $._ajax('/gdc/account/login/'+profileId, {
                    type: 'delete'
                });
            }).done(function(data) {
                ds.clear();
            });
        };
    }).

    factory('bootstrap', function(ds) {
        return function() {
            return ds('/gdc/app/account/bootstrap');
        };
    }).
    factory('projects', function(ds, bootstrap) {
        return function() {
            return bootstrap().pipe(function(bootstrapResource) {
                var profileUrl = bootstrapResource.accountSetting.links.self;
                return ds(profileUrl+'/projects');
            });
        };
    }).

    factory('dashboards', function(ds, bootstrap) {
        return function(projectId) {
            return bootstrap().pipe(function() {
                var url = '/gdc/md/'+projectId+'/query/projectdashboards';
                return ds(url);
            });
        };
    }).
    factory('dashboardView', function(ds, bootstrap) {
        return function(projectId, dashboardId) {
            return bootstrap().pipe(function() {
                var url = '/gdc/md/'+projectId+'/obj/'+dashboardId+'/view';
                return ds(url);
            });
        };
    });