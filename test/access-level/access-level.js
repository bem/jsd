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
     * @private
     */
    method1 : function() {

    },

    /**
     * Description of method2
     * @protected
     */
    method2 : function() {
    },

    /**
     * Description of method3
     * @public
     */
    method3 : function() {
    },

    /**
     * Description of method4
     */
    method4 : function() {
    }
}, /** @lends ModuleClass */ {
    /**
     * Description of static method
     * @private
     */
    staticMethod : function() {

    }
});

provide(ModuleClass);

});