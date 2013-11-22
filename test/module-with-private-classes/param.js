/**
 * @module my-module
 */

modules.define(function(provide) {

/** @class A */
function A() {}

A.prototype = /** @lends A.prototype */{
    /**
     * Method
     * @param {B} b
     */
    method : function(b) {}
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
    /**
     * @exports my-module
     * @param {A} a
     */
    function(a) {}
);

});