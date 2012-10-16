/*global Utils, GdcLegacy */

(function(angular) {


angular.module('gdDashboardViews', []).
    value('dashboardItemFactory', {
        // can be plugged form outside
        textItem: function(item, el) {
            el.html(GdcLegacy.wikiToHtml(item.text));
            el.addClass(item.textSize);
        },

        lineItem: function(item, el) {
            el.addClass(item.orientation || 'horizontal');
            el.html('<div></div>');
        },

        iframeItem: function(item, el) {
            el.append($('<iframe>').attr({
                src: item.url,
                width: item.sizeX,
                height: item.sizeY
            }));
        },

        filterItem: function(item, el) {
            el.append($('<select>').attr({
                width: item.sizeX,
                height: item.sizeY
            }).append('<option>'+item.content.label+'</option>'));
        }
    }).
    directive('dashboarditem', function(dashboardItemFactory) {
        //TODO item from outside
        return {
            //priority: 0,
            replace: true,
            //transclude: false,
            restrict: 'C',
            //restrict: 'A',
            //scope: false,
            link: function(scope, element, attrs) {
                var itemType = Utils.objectType(scope.item),
                    item = scope.item[itemType];

                element.addClass(itemType);
                element.css({
                    left: item.positionX,
                    top: item.positionY,
                    width: item.sizeX,
                    height: item.sizeY
                });

                //TODO use controller based reports ?

                if (dashboardItemFactory[itemType]) {
                    //passing reportExecute is not clean
                    dashboardItemFactory[itemType](item, element);
                } else {
                    element.text(itemType + " > " + JSON.stringify(item));
                }
            }
        };
    });

})(angular);