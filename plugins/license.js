module.exports = function(jsdoc) {
    jsdoc
        .registerParser('license', function(comment) {
            return { content : comment };
        })
        .registerBuilder('license', function(tag, curJsdocNode) {
            curJsdocNode.license = tag.content;
        });
};
