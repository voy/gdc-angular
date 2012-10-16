/*global Utils */

angular.module('gdDataStore', []).
    factory('ds', function() {

        function unpackResource(res) {
            res = Utils.unpack(res);
            if ($.isArray(res)) {
                res = Utils.unpackEach(res);
            }
            //console.log('resource fetched', arguments[0], res);
            return res;
        }

        var cache = {},
            fetching = {};

        //shortcut - store itself is get function
        var ds = function() {
            return ds.get.apply(this, arguments);
        };

        ds.get = function(uri) {
            var d = $.Deferred();
            if (cache[uri]) {
                //must be in timeout to finish possible previous Angular $digest run
                setTimeout(function() {
                    d.resolve(cache[uri]);
                }, 1);
            } else {
                if (!fetching[uri]) {
                    fetching[uri] = $.get(uri);
                }
                fetching[uri].done(function(res) {
                    res = unpackResource(res);
                    cache[uri] = res;
                    delete fetching[uri];
                    d.resolve(res);
                }).fail(function() {
                    delete fetching[uri];
                    d.reject.apply(d, arguments);
                });
            }
            return d;
        };

        ds.clear = function() {
            cache = {};
            //TODO should also cancel fetchs in progress
        };

        return ds;
    });