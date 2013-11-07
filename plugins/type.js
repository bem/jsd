module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('type', function(comment) {
            return { jsType : comment };
        })
        .registerTagsStartBuilder(function(tags, jsdocNode) {
            if(tags.hasTagByType('type')) {
                return { type : 'type' };
            }

            this._startTagsJsdocNode = jsdocNode;
        })
        .registerTagsEndBuilder(function(tags, jsdocNode, astNode) {
            var startTagsJsdocNode = this._startTagsJsdocNode;
            delete this._startTagsJsdocNode;

            if(startTagsJsdocNode === jsdocNode) {
                if(astNode.type === 'ObjectExpression') { // TODO: we need to consider more cases
                    return { type : 'type', jsType : 'Object' };
                }
            }
        })
        .registerTagBuilder('type', function(tag, jsdocNode) {
            jsdocNode.jsType = tag.jsType;
        });
};