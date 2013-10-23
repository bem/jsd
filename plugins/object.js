module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc.registerNode('object', INHERIT({
            __constructor : function() {
                this.fields = [];
            },

            addField : function(node) {
                this.fields.push(node);
            }
        }, {
            type : 'object'
        }));
};