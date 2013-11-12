/**
 * @module my-module
 */

modules.define(function(provide) {

/** @class A */
function A() {}

A.prototype = /** @lends A.prototype */{
    /**
     * Method
     */
    method : function() {}
};

provide(
    /**
     * @exports my-module
     * @returns {A}
     */
    function() {}
);

});