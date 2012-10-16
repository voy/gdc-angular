
var Utils = {
    objectType: function(obj) {
        for (var key in obj) {
            if (key === 'meta') continue;
            return key;
        }
    },

    unpack: function(obj) {
        return obj[Utils.objectType(obj)];
    },

    unpackEach: function(objArray) {
        return objArray.map(Utils.unpack);
    },

    url2id: function(url) {
        return url.split('/').slice(-1)[0];
    }
};

/*  Fn sugar */

/** fn.scope($scope) returns new function called in angular $scope */
Function.prototype.withScope = function($scope) {
    var fn = this;
    return function() {
        var ctx = this,
            args = arguments;
        $scope.$apply(function() {
            fn.apply(ctx, args);
        });
    };
};

/** covnert function to promise (which is immediatelly resolved when is invoked */
Function.prototype.promise = function() {
    var fn = this;
    return function() {
        return $.Deferred().resolve(fn.apply(this, arguments));
    };
};