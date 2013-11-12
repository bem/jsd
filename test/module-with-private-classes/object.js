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

/** @class B */
function B() {}

B.prototype = /** @lends B.prototype */{
    /**
     * MethodB
     */
    methodB : function() {}
};

provide(
    /** @exports my-module */
    {
        /**
         * Method1
         * @param {A} a
         */
        method1 : function(a) {},

        /**
         * Method2
         * @returns {B}
         */
        method2 : function() {}
    }
);

});