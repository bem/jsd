module.exports = function(jsdoc) {
    jsdoc
        .registerTag('description', function(comment) {
            return { content : comment };
        })
        .registerBuilder(function(tag) {
            tag.type === 'description' && (this.jsdocNode.description = tag.content);
        });
};
