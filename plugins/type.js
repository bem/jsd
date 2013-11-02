module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('type', function(comment) {
            return { jsType : comment };
        })
        .registerTagsBuilder(function(tags) {
            if(tags.hasTagByType('type')) {
                return { type : 'type' };
            }
        })
        .registerTagBuilder('type', function(tag, jsdocNode) {
            jsdocNode.jsType = tag.jsType;
        });
};