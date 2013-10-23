module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc.registerNode('root', INHERIT({
        __constructor : function() {
            this.modules = [];
        },

        addModule : function(module) {
            this.modules.push(module);
        }
    }, {
        type : 'root'
    }));
};
