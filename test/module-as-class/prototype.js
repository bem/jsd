/**
 * @module my-module
 */

modules.define('my-module', function(provide) {

/**
 * @class ModuleClass
 * @exports my-module
 */
var ModuleClass = function() {};

ModuleClass.prototype =/** @lends ModuleClass.prototype */{
    /**
     * Description of method1
     */
    method1 : function() {

    },

    /**
     * Description of method2
     */
    method2 : function() {
    }
};

provide(ModuleClass);

});