module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc
        .registerTag('module', function(comment) {
            return { name : comment };
        })
        .registerNode('module', INHERIT({
            __constructor : function(name) {
                this.name = name;
                this.description = '';
                this.exports = [];
            },

            addExport : function(node) {
                this.exports.push(node);
            }
        }, {
            type : 'module'
        }))
        .registerBuilder(
            function() {
                this.modules = {};
            },
            function(tag, jsdocNode) {
                tag.type === 'module' &&
                    jsdocNode.addModule(
                        this.jsdocNode = this.modules[tag.name] = jsdoc.createNode('module', tag.name));
            });
};
