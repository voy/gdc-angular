/*global credentials */

angular.module('gdXhr', []).
    run(function($location, $rootScope) {

        var tokenRequest,
            POLL_DELAY = 1000;

        function retryAjaxRequest(req, deffered) {
            $.ajax(req).done(function(data, textStatus, xhr) {
                deffered.resolve(data, textStatus, xhr);
            }).fail(function(xhr, textStatus, err) {
                deffered.reject(xhr, textStatus, err);
            });
        }

        function continueAfterTokenRequest(req, deffered) {
            tokenRequest.done(function() {
                retryAjaxRequest(req, deffered);
            }).fail(function(xhr, textStatus, err) {
                deffered.reject(xhr, textStatus, err);
            });
        }

        function handleUnauthorized(req, deffered) {
            if (!tokenRequest) {
                //create only single /token/request
                tokenRequest = $._ajax('/gdc/account/token/').done(function() {
                    tokenRequest = null;
                }).fail(function(xhr, textStatus, err) {
                    tokenRequest = null;
                    if (xhr.status == 401) {
                        //unauthorized when retrieving token -> not logged
                        $rootScope.$apply(function() {
                            $location.path('/login');
                        });
                    }
                });
            }
            continueAfterTokenRequest(req, deffered);
        }

        function handlePolling(req, deffered) {
            setTimeout(function() {
                retryAjaxRequest(req, deffered);
            }, POLL_DELAY);
        }

        $._ajax = $.ajax; //backup original $.ajax
        $.ajax = function(url, settings) {
            var d = $.Deferred();
            if (tokenRequest) {
                continueAfterTokenRequest(settings, d);
                return d;
            }
            $._ajax(url, settings).fail(function(xhr, textStatus, err) {
                if (xhr.status == 401) {
                    handleUnauthorized(this, d);
                } else {
                    d.reject(xhr, textStatus, err);
                }
            }).done(function(data, textStatus, xhr) {
                if (xhr.status == 202) {
                    handlePolling(this, d);
                } else {
                    d.resolve(data, textStatus, xhr);
                }
            });
            return d;
        };

        $.ajaxSetup({
            contentType: 'application/json',
            dataType: 'json'
        });
    });