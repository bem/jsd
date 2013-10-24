module.exports = function(jsdoc) {
    jsdoc
        .registerBuilder(function(tag, jsdocNode, astNode) {
            if(tag.isFirst) {
                switch(astNode.type) {
                    case 'FunctionExpression':
                    case 'FunctionDeclaration':
                    case 'VariableDeclaration':
                        if(astNode.type === 'VariableDeclaration') {
                            var firstDecl = astNode.declarations[0].init;
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
            }
        });
};