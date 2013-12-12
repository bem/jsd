module.exports = function(jsdoc) {
    jsdoc
        .registerParser('version', String)
        .registerBuilder('version', function(tag, curJsdocNode) {
            curJsdocNode.version = tag.content;
        });
};
