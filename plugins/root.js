module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc.registerNode('root', INHERIT({
        __constructor : function() {
            this.type = 'root';
        }
    }));
};
