module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc
        .registerNode('function', INHERIT({
            __constructor : function(name) {
                this.type = 'function';
                this.name = name;
                this.description = '';
            }
        }))
        .registerBuilder(function(tag, jsdocNode, astNode) {
            tag.isFirst && astNode.type === 'Property' && astNode.value.type === 'FunctionExpression' &&
                (jsdocNode.fields || (jsdocNode.fields = [])).push(
                    this.jsdocNode = jsdoc.createNode('function', astNode.key.value || astNode.key.name));
        });

};