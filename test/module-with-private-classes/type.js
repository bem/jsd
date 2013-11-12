/**
 * @module my-module
 */

modules.define(function(provide) {

provide(
    /**
     * @exports my-module
     * @type A
     */
    new (/** @class A */inherit(/** @lends A.prototype */{
        /**
         * Method
         */
        method : function() {}
    }))()
);

});