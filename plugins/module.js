module.exports = function(jsdoc) {
    jsdoc
        .registerTag('module', function(comment) {
            return { name : comment };
        })
        .registerBuilder(function(tag, jsdocNode) {
            switch(tag.type) {
                case 'module':
                    (jsdocNode.modules || (jsdocNode.modules = [])).push(
                        this.jsdocNode =
                            (this.modules || (this.modules = {}))[tag.name] =
                                { type : 'module', name : tag.name });
                break;

                case 'alias':
                    var matches = tag.to.split(':');
                    if(matches.length === 2) {
                        var module = this.modules[matches[0]];
                        (module.exports || (module.exports = [])).push(
                            { type : 'export', name : matches[1], content : this.jsdocNode });
                    }
                break;
            }
        });
};
