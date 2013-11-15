module.exports = function(jsdoc) {
    jsdoc
        .registerParser('exports', function(comment) {
            return { name : comment };
        })
        .registerBuilder('exports', function(tag, curJsdocNode) {
            var matches = tag.name.split(':'),
                exportedProp = matches[1],
                moduleName = exportedProp? matches[0] : tag.name,
                module = this.modules[moduleName];

            if(!module)
                throw Error('Unknown module: ' + moduleName);

            return exportedProp?
                (module.exports || (module.exports = {
                    type : 'type',
                    jsType : 'Object',
                    props : {}
                })).props[exportedProp] = curJsdocNode :
                module.exports || (module.exports = curJsdocNode);
        });
};
