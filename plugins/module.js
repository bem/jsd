module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('module', function(comment) {
            return { name : comment };
        })
        .registerTagParser('exports', function(comment) {
            return { name : comment };
        })
        .registerTagBuilder('module', function(tag, jsdocNode) {
            var moduleNode = { type : 'module', name : tag.name };
            (jsdocNode.modules || (jsdocNode.modules = [])).push(
                (this.modules || (this.modules = {}))[tag.name] = moduleNode);
            return moduleNode;
        })
        .registerTagBuilder('exports', function(tag, jsdocNode, astNode) {
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
        })
        .registerTagBuilder('alias', function(tag, jsdocNode) {
            var matches = tag.to.split(':');
            if(matches.length === 2) {
                var module = this.modules[matches[0]];
                jsdocNode.name = matches[1];
                (module.exports || (module.exports = {
                    type : 'object',
                    fields : []
                })).fields.push(jsdocNode);
            }
        });
};
