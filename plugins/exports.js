module.exports = function(jsdoc) {
    jsdoc
        .registerParser('exports', function(comment) {
            return { name : comment };
        })
        .registerBuilder('exports', function(tag, curJsdocNode) {
            var exportsName = tag.name;

            if(!exportsName) {
                if(!this.currentModule)
                    throw Error('Can not find module for implicit @exports');
                    
                exportsName = this.currentModule.name;
            }

            var matches = exportsName.split(':'),
                exportedProp = matches[1],
                moduleName = exportedProp? matches[0] : exportsName,
                module = this.modules[moduleName];

            if(!module)
                throw Error('Unknown module: ' + moduleName);

            return exportedProp?
                (module.exports || (module.exports = {
                    jsdocType : 'type',
                    jsType : 'Object',
                    props : {}
                })).props[exportedProp] = curJsdocNode :
                module.exports || (module.exports = curJsdocNode);
        });
};
