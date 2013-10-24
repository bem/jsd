module.exports = function(jsdoc) {
    jsdoc
        .registerTag('description', function(comment) {
            return { content : comment };
        })
        .registerBuilder(function(tag, jsdocNode) {
            tag.type === 'description' && (jsdocNode.description = tag.content);
        });
};
