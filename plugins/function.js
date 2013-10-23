module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc
        .registerNode('function', INHERIT({
            __constructor : function(name) {
                this.name = name;
                this.description = '';
                this.isConstructor = false;
                this.params = [];
                this.returns = undefined;
            },

            addParam : function(param) {
                this.params.push(param);
            }
        }, {
            type : 'function'
        }))
        .registerBuilder(function(tag, jsdocNode, astNode) {
            tag.isFirst && astNode.type === 'Property' && astNode.value.type === 'FunctionExpression' &&
                jsdocNode.addField(
                    this.jsdocNode = jsdoc.createNode('function', astNode.key.value || astNode.key.name));
        });

};