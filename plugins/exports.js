module.exports = function(jsdoc) {
    jsdoc
        .registerParser('exports', function(comment) {
            return { name : comment };
        })
        .registerBuilder('exports', function(tag, curJsdocNode) {
            var module = this.modules[tag.name];
            if(!module) throw Error('Unknown module: ' + tag.name);
            return module.exports || (module.exports = curJsdocNode);
        })
        .registerBuilder('alias', function(tag, curJsdocNode) {
            var matches = tag.to.split(':');

            if(matches[1]) {
                var module = this.modules[matches[0]];
                (module.exports || (module.exports = {
                    type : 'type',
                    jsType : 'Object',
                    props : {}
                })).props[matches[1]] = curJsdocNode;
            }
        });
};
