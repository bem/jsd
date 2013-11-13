/**
 * @module my-module
 */

modules.define(function(provide) {

/** @class A */
function A() {}

A.prototype = /** @lends A.prototype */{
    /**
     * MethodA
     */
    methodA : function() {}
};

provide(
    /**
     * @exports my-module
     * @type C
     */
    new (
        /**
         * @class C
         * @augments A
         */
        inherit(A, {}))()
);

});