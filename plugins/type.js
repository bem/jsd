module.exports = function(jsdoc) {
    jsdoc
        .registerParser('type', function(comment) {
            return { jsType : comment };
        })
        .registerBuilder('type', function(tag, jsdocNode, astNode) {
            var res = buildTypeNode(jsdocNode, astNode);
            res.jsType === '*' && (res.jsType = tag.jsType);
            return res;
        })
        .registerBuilder(function(tags, jsdocNode, astNode, isChanged) {
            if(!isChanged) {
                return buildTypeNode(jsdocNode, astNode);
            }
        });
};

function buildTypeNode(jsdocNode, astNode) {
    switch(astNode.type) {
        case 'FunctionExpression':
        case 'FunctionDeclaration':
            return { type : 'type', jsType : 'Function' };

        case 'VariableDeclaration':
            return buildTypeNode(jsdocNode, astNode.declarations[0]);

        case 'VariableDeclarator':
            return astNode.init?
                buildTypeNode(jsdocNode, astNode.init) :
                buildUnknownTypeNode();

        case 'Property':
            switch(astNode.value.type) {
                case 'FunctionExpression':
                    return buildTypeNodeInProperty(jsdocNode, astNode, 'Function');

                case 'Literal':
                    var value = astNode.value.value,
                        typeNode = buildTypeNodeInProperty(getLiteralJsType(value), jsdocNode, astNode);

                    typeNode.jsValue = value;
                    return typeNode;

                default:
                    return buildUnknownTypeNode();
            }

        case 'Literal':
            return {
                type : 'type',
                jsType : getLiteralJsType(astNode.value),
                jsValue : astNode.value
            };

        case 'ObjectExpression':
            return { type : 'type', jsType : 'Object', props : {} };

        default:
            return buildUnknownTypeNode();
    }
}

function buildTypeNodeInProperty(jsdocNode, astNode, jsType) {
    var res = { type : 'type', jsType : jsType };
    jsdocNode.props[astNode.key.value || astNode.key.name] = res;
    return res;
}

function buildUnknownTypeNode() {
    return { type : 'type', jsType : '*' };
}

function getLiteralJsType(value) {
    var typeOfValue = typeof value;
    return typeOfValue[0].toUpperCase() + typeOfValue.substr(1);
}