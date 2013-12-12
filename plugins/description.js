module.exports = function(jsdoc) {
    jsdoc
        .registerParser('description', String)
        .registerBuilder('description', function(tag, curJsdocNode) {
            curJsdocNode.description = tag.content;
        });
};
