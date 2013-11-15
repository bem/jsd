module.exports = function(jsdoc) {
    jsdoc
        .registerParser('example', function(comment) {
            return { content : comment };
        })
        .registerBuilder('example', function(tag, curJsdocNode) {
            curJsdocNode.example = tag.content;
        });
};
