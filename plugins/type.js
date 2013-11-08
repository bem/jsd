module.exports = function(jsdoc) {
    jsdoc
        .registerParser('type', function(comment) {
            return { jsType : comment };
        })
        .registerBuilder('type', function(tag, jsdocNode, astNode) {
            switch(astNode.type) {
                case 'Property':
                    return buildTypeNodeInProperty(tag.jsType, jsdocNode, astNode);
            }

            var res = { type : 'type', jsType : tag.jsType };
            tag.jsType === 'Object' && (res.props = {});
            return res;
        })
        .registerBuilder(function process(tags, jsdocNode, astNode, isChanged) {
            if(isChanged) {
                return;
            }

            switch(astNode.type) {
                case 'FunctionExpression':
                case 'FunctionDeclaration':
                    return { type : 'type', jsType : 'Function' };

                case 'VariableDeclaration':
                    return process(tags, jsdocNode, astNode.declarations[0], isChanged);

                case 'VariableDeclarator':
                    if(astNode.init) {
                        return process(tags, jsdocNode, astNode.init, isChanged);
                    }
                break;

                case 'Property':
                    switch(astNode.value.type) {
                        case 'FunctionExpression':
                            return buildTypeNodeInProperty(jsdocNode, astNode, 'Function');

                        case 'Literal':
                            var value = astNode.value.value,
                                typeNode = buildTypeNodeInProperty(getLiteralJsType(value), jsdocNode, astNode);

                            typeNode.jsValue = value;
                            return typeNode;
                    }
                break;

                case 'Literal':
                    return {
                        type : 'type',
                        jsType : getLiteralJsType(astNode.value),
                        jsValue : astNode.value
                    };

                case 'ObjectExpression':
                    return { type : 'type', jsType : 'Object', props : {} };
            }
        });
};

function buildTypeNodeInProperty(jsdocNode, astNode, jsType) {
    var res = { type : 'type', jsType : jsType };
    jsdocNode.props[astNode.key.value || astNode.key.name] = res;
    return res;
}

function getLiteralJsType(value) {
    var typeOfValue = typeof value;
    return typeOfValue[0].toUpperCase() + typeOfValue.substr(1);
}