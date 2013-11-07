module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('type', function(comment) {
            return { jsType : comment };
        })
        .registerTagsStartBuilder(function(tags, jsdocNode, astNode) {
            this._startTagsJsdocNode = jsdocNode;

            if(tags.hasTagByType('type')) {
                switch(astNode.type) {
                    case 'Property':
                        return buildTypeNodeInProperty(jsdocNode, astNode);
                }
                return { type : 'type' };
            }
        })
        .registerTagsEndBuilder(function(tags, jsdocNode, astNode) {
            var startTagsJsdocNode = this._startTagsJsdocNode;
            delete this._startTagsJsdocNode;

            if(startTagsJsdocNode === jsdocNode) {
                switch(astNode.type) {
                    case 'Property':
                        if(astNode.value.type === 'Literal') {
                            var typeNode = buildTypeNodeInProperty(jsdocNode, astNode),
                                value = astNode.value.value;

                            typeNode.jsType = getLiteralJsType(value);
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
                        return { type : 'type', jsType : 'Object' };
                }
            }
        })
        .registerTagBuilder('type', function(tag, jsdocNode) {
            jsdocNode.jsType = tag.jsType;
        });
};

function buildTypeNodeInProperty(jsdocNode, astNode) {
    var res = { type : 'type', name : astNode.key.value || astNode.key.name };
    (jsdocNode.fields || (jsdocNode.fields = [])).push(res);
    return res;
}

function getLiteralJsType(value) {
    var typeOfValue = typeof value;
    return typeOfValue[0].toUpperCase() + typeOfValue.substr(1);
}