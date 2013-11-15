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
     * @protected
     */
    method1 : function() {

    },

    /**
     * Description of method2
     */
    method2 : function() {
    }
}, /** @lends ModuleClass */ {
    /**
     * Description of static method
     * @protected
     */
    staticMethod : function() {

    }
});

provide(ModuleClass);

});