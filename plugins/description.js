module.exports = function(jsdoc) {
    jsdoc
        .registerParser('description', function(comment) {
            return { content : comment };
        })
        .registerBuilder('description', function(tag, jsdocNode) {
            jsdocNode.description = tag.content;
        });
};
