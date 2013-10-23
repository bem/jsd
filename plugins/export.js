module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc.registerNode('export', INHERIT({
            __constructor : function(name, content) {
                this.name = name;
                this.content = content;
            }
        },
        {
            type : 'export'
        }));
};