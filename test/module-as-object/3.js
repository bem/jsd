/**
 * @module my-module
 */

modules.define('my-module', function(provide) {

/**
 * @exports my-module
 * @type Object
 */
var obj = {
    /**
     * Method export
     */
    export : function() {}
};

provide(obj);

});