module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('module', function(comment) {
            return { name : comment };
        })
        .registerTagParser('exports', function(comment) {
            return { name : comment };
        })
        .registerTagsEndBuilder(function(tags, jsdocNode) {
            var exportsTag = tags.getTagByType('exports');
            if(exportsTag) {
                var module = this.modules[exportsTag.name];
                return module.exports || (module.exports = jsdocNode);
            }
            else {
                var aliasTag = tags.getTagByType('alias');
                if(aliasTag) {
                    var matches = aliasTag.to.split(':'),
                        module = this.modules[matches[0]];

                    if(matches.length === 1) {
                        module.exports = jsdocNode;
                    }
                    else {
                        jsdocNode.name = matches[1];
                        (module.exports || (module.exports = {
                            type : 'type',
                            jsType : 'Object',
                            fields : []
                        })).fields.push(jsdocNode);
                    }
                }
            }
        })
        .registerTagBuilder('module', function(tag, jsdocNode) {
            var moduleNode = { type : 'module', name : tag.name };
            (jsdocNode.modules || (jsdocNode.modules = [])).push(
                (this.modules || (this.modules = {}))[tag.name] = moduleNode);
            return moduleNode;
        });
};