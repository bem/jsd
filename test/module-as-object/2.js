/**
 * @module my-module
 */

modules.define('my-module', function(provide) {

/**
 * @class Export1
 * @alias my-module:Export1
 */
var Export1 = inherit({});

provide(/** @exports my-module */{
    Export1 : Export1,

    /**
     * Method export2
     */
    export2 : function(p1) {}
});

});