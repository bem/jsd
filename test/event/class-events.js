/**
 * @module my-module
 */

modules.define('my-module', function(provide) {

/**
 * @class ModuleClass
 * @exports my-module
 */

/**
 * @event event1
 * @param {events:Event} e
 * @param {Object} data
 */

/**
 * @event event2
 * @param {events:Event} e
 */

var ModuleClass = inherit(/** @lends ModuleClass.prototype */{});

provide(ModuleClass);

});