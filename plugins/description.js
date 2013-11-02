module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('description', function(comment) {
            return { content : comment };
        })
        .registerTagBuilder('description', function(tag, jsdocNode) {
            jsdocNode.description = tag.content;
        });
};
