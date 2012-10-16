/*global Utils, GdcLegacy */

(function(angular) {


// TODO move DOM markup to templates

function renderImage(item, el, imageResult) {
    el.text('Fetching image result...');
    $.get(imageResult).done(function(data) {
        el.empty();
        if (!data) { //204 - no conent
            return;
        }
        var imgUrl = data.imageResult.image;
        el.append($('<img>').attr({
            src: imgUrl,
            width: item.sizeX,
            height: item.sizeY
        }));
    });
}

/* creates simple grid without headders */
function createTable(xtab) {
    var t = $('<table>').addClass('grid');
    for (var i = 0; i < xtab.size.rows; i++) {
        var row = $('<tr>').addClass(i % 2 ? 'odd' : 'even');
        for (var j = 0; j < xtab.size.columns; j++) {
            row.append($('<td>').text(xtab.data[i][j]));
        }
        t.append(row);
    }
    return t;
}

function renderGrid(item, el, reportView, dataResult) {
    el.empty();
    el.text(reportView.reportName);
    $.get(dataResult).done(function(data) {
        var xtab = data.xtab_data;
        el.append(createTable(xtab));
    });
}

function renderOneNumber(item, el, reportView, dataResult) {
    el.empty();

    $.get(dataResult).done(function(data) {
        if (!data) return;
        var xtab = data.xtab_data;
        var fontSize = parseInt(item.sizeY * 4/5, 10);
        var value = xtab.data[0][0];
        var format = reportView.metrics[0].format;
        var colorObj = GdcLegacy.colors2Object(GdcLegacy.numberFormat(value, format)),
            label = colorObj.label;

        delete colorObj.label;
        el.append($('<span>').text(label).css('font-size', fontSize).css(colorObj));
    });
}


angular.module('gdReportItemView', ['gdReportExecution', 'gdDashboardViews']).
    run(function(dashboardItemFactory, reportExecute) {
        dashboardItemFactory.reportItemView = function(item, el) {
            el.text('Rendering...');
            var context = null;
            //backend image rendering
            context = { imageSpecification: {
                sizeX: item.sizeX,
                sizeY: item.sizeY
            }};

            reportExecute(item.obj, context).pipe(function(data) {
                var imageResult = data.content.imageResult,
                    reportView = data.content.reportView;

                if (imageResult) {
                    renderImage(item, el, imageResult);
                } else if (reportView.format === 'grid') {
                    renderGrid(item, el, reportView, data.content.dataResult);
                } else if (reportView.format === 'oneNumber') {
                    renderOneNumber(item, el, reportView, data.content.dataResult);
                } else {
                    el.text(JSON.stringify(data));
                }
            });
        };
    });


})(angular);
