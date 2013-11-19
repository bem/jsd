module.exports = function(jsdoc) {
    jsdoc
        .registerParser('version', function(comment) {
            return { version : comment.trim() };
        })
        .registerBuilder('version', function(tag, curJsdocNode) {
            curJsdocNode.version = tag.version;
        });
};
