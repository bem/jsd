module.exports = function(jsdoc) {
    jsdoc
        .registerParser('example', String)
        .registerBuilder('example', function(tag, curJsdocNode) {
            (curJsdocNode.examples || (curJsdocNode.examples = [])).push(tag.content);
        });
};
