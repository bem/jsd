module.exports = function(jsdoc) {
    jsdoc
        .registerParser('module', function(comment) {
            return { name : comment };
        })
        .registerParser('exports', function(comment) {
            return { name : comment };
        })
        .registerBuilder('module', function(tag, jsdocNode) {
            var moduleNode = { type : 'module', name : tag.name };
            (jsdocNode.modules || (jsdocNode.modules = [])).push(
                (this.modules || (this.modules = {}))[tag.name] = moduleNode);
            return moduleNode;
        })
        .registerBuilder('exports', function(tag, jsdocNode) {
            var module = this.modules[tag.name];
            return module.exports || (module.exports = jsdocNode);
        })
        .registerBuilder('alias', function(tag, jsdocNode) {
            var matches = tag.to.split(':'),
                module = this.modules[matches[0]];

            if(matches.length === 1) {
                module.exports = jsdocNode;
            }
            else {
                (module.exports || (module.exports = {
                    type : 'type',
                    jsType : 'Object',
                    props : {}
                })).props[matches[1]] = jsdocNode;
            }
        });
};