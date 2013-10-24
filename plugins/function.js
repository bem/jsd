module.exports = function(jsdoc) {
    jsdoc
        .registerBuilder(function(tag, jsdocNode, astNode) {
            if(tag.isFirst && astNode.type === 'Property' && astNode.value.type === 'FunctionExpression') {
                var functionNode = { type : 'function', name :  astNode.key.value || astNode.key.name };
                (jsdocNode.fields || (jsdocNode.fields = [])).push(functionNode);
                return functionNode;
            }
        });
};