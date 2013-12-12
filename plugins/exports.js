module.exports = function(jsdoc) {
    jsdoc
        .registerParser('exports', String)
        .registerBuilder('exports', function(tag, curJsdocNode) {
            var exportsName = tag.content;

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

            if(exportedProp) {
                (module.exports || (module.exports = {
                    jsdocType : 'type',
                    jsType : 'Object',
                    props : []
                })).props.push({ key : exportedProp, val : curJsdocNode });
                return curJsdocNode;
            }
            else {
                return module.exports || (module.exports = curJsdocNode);
            }
        });
};
