module.exports = function(jsdoc) {
    jsdoc
        .registerParser('exports', function(comment) {
            return { name : comment };
        })
        .registerBuilder('exports', function(tag, jsdocNode) {
            var module = this.modules[tag.name];
            return module.exports || (module.exports = jsdocNode);
        })
        .registerBuilder('alias', function(tag, jsdocNode) {
            var matches = tag.to.split(':');

            if(matches[1]) {
                var module = this.modules[matches[0]];
                (module.exports || (module.exports = {
                    type : 'type',
                    jsType : 'Object',
                    props : {}
                })).props[matches[1]] = jsdocNode;
            }
        });
};