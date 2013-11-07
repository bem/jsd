module.exports = function(jsdoc) {
    jsdoc.registerTagsStartBuilder(function(tags, jsdocNode, astNode) {
        switch(astNode.type) {
            case 'FunctionExpression':
            case 'FunctionDeclaration':
            case 'VariableDeclaration':
            case 'VariableDeclarator':
                if(astNode.type === 'VariableDeclaration' || astNode.type === 'VariableDeclarator') {
                    var firstDecl = astNode.type === 'VariableDeclaration'?
                            astNode.declarations[0].init :
                            astNode.init;
                    if(!firstDecl || firstDecl.type !== 'FunctionExpression') {
                        return;
                    }
                }

                var functionNode = { type : 'function' };

                if(jsdocNode.type === 'function') {
                    jsdocNode.content = functionNode;
                }

                return functionNode;
            break;

            case 'Property':
                if(astNode.value.type === 'FunctionExpression') {
                    var functionNode = { type : 'function', name : astNode.key.value || astNode.key.name };
                    (jsdocNode.fields || (jsdocNode.fields = [])).push(functionNode);
                    return functionNode;
                }
            break;
        }
    });
};