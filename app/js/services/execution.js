/*global Utils */

angular.module('gdReportExecution', []).
    factory('reportExecute', function($routeParams) {
        var runningTasks = 0,
            waitingTasks = [],
            itemsAtOnce = 8; //should be 6 for IE<9 otherwise 8

        function run() {
            while (runningTasks <= itemsAtOnce && waitingTasks.length) {
                var task = waitingTasks.pop();
                execute(task);
            }
        }

        function taskEnd() {
            runningTasks--;
            run();
        }

        function execute(task) {
            runningTasks++;
            var currentProjectId = $routeParams.projectId;
            return $.ajax(task.url, {
                type: 'post',
                data: task.data
            }).pipe(Utils.unpack.promise()).done(function() {
                taskEnd();
                task.promise.resolve.apply(task.promise, arguments);
            }).fail(function() {
                taskEnd();
                task.promise.reject.apply(task.promise, arguments);
            });
        }

        return function(reportUrl, context) {
            var currentProjectId = $routeParams.projectId,
                data = {
                    report: reportUrl
                };
            if (context) data.context = context;

            var d = $.Deferred();
            waitingTasks.push({
                promise: d,
                url: '/gdc/app/projects/'+currentProjectId+'/execute',
                data: JSON.stringify({ report_req: data })
            });
            run();
            return d;
        };
    });