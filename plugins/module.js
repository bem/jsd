module.exports = function(jsdoc) {
    jsdoc
        .registerTag('module', function(comment) {
            return { name : comment };
        })
        .registerBuilder(function(tag, jsdocNode) {
            switch(tag.type) {
                case 'module':
                    var moduleNode = { type : 'module', name : tag.name };
                    (jsdocNode.modules || (jsdocNode.modules = [])).push(
                        (this.modules || (this.modules = {}))[tag.name] = moduleNode);
                    return moduleNode;

                case 'alias':
                    var matches = tag.to.split(':');
                    if(matches.length === 2) {
                        var module = this.modules[matches[0]];
                        (module.exports || (module.exports = [])).push(
                            { type : 'export', name : matches[1], content : jsdocNode });
                    }
                break;
            }
        });
};
