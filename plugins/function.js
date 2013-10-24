module.exports = function(jsdoc) {
    jsdoc
        .registerBuilder(function(tag, jsdocNode, astNode) {
            if(tag.isFirst) {
                if(astNode.type === 'Property' && astNode.value.type === 'FunctionExpression') {
                    var functionNode = { type : 'function', name :  astNode.key.value || astNode.key.name };
                    (jsdocNode.fields || (jsdocNode.fields = [])).push(functionNode);
                    return functionNode;
                }
                else if(astNode.type === 'FunctionExpression') {
                    var functionNode = { type : 'function' };
                    if(jsdocNode.type === 'module') {
                        jsdocNode.exports = functionNode;
                    }
                    else {
                        throw Error('Unexpected function expression');
                    }

                    return functionNode;
                }
            }
        });
};