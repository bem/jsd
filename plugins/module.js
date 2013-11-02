module.exports = function(jsdoc) {
    jsdoc
        .registerTag('module', function(comment) {
            return { name : comment };
        })
        .registerTag('exports', function(comment) {
            return { name : comment };
        })
        .registerBuilder(function(tag, jsdocNode, astNode) {
            switch(tag.type) {
                case 'module':
                    var moduleNode = { type : 'module', name : tag.name };
                    (jsdocNode.modules || (jsdocNode.modules = [])).push(
                        (this.modules || (this.modules = {}))[tag.name] = moduleNode);
                    return moduleNode;

                case 'exports':
                    var module = this.modules[tag.name];
                    if(astNode.type === 'FunctionExpression') {
                        return module.exports = jsdocNode;
                    }
                    else if(astNode.type === 'ObjectExpression') {
                        return (module.exports || (module.exports = {
                            type : 'object',
                            fields : []
                        }));
                    }
                break;

                case 'alias':
                    var matches = tag.to.split(':');
                    if(matches.length === 2) {
                        var module = this.modules[matches[0]];
                        jsdocNode.name = matches[1];
                        (module.exports || (module.exports = {
                            type : 'object',
                            fields : []
                        })).fields.push(jsdocNode);
                    }
                break;
            }
        });
};
