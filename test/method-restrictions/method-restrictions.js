/**
 * @module my-module
 */

modules.define('my-module', function(provide) {

/**
 * @class ModuleClass
 * @exports my-module
 */
var ModuleClass = inherit(/** @lends ModuleClass.prototype */{
    /**
     * Description of method1
     * @abstract
     */
    method1 : function() {

    },

    /**
     * Description of method1
     * @override
     */
    method2 : function() {

    },

    /**
     * Description of method1
     * @final
     */
    method3 : function() {

    }
});

provide(ModuleClass);

});