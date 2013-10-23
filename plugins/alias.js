module.exports = function(jsdoc) {
    jsdoc
        .registerTag('alias', function(comment) {
            var tag = {},
                matches = comment.split(':');
            matches.length === 2 && (tag.module = matches.shift(matches));
            tag.to = matches[0];
            return tag;
        })
        .registerBuilder(function(tag) {
            if(tag.type === 'alias') {
                var modules = this.modules;
                if(tag.module) {
                    modules[tag.module].addExport(jsdoc.createNode('export', tag.to, this.jsdocNode));
                }
                else if(modules.hasOwnProperty(tag.to)) {
                    modules[tag.to].exports = this.jsdocNode;
                }
            }
        });
};