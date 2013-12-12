module.exports = function(jsdoc) {
    jsdoc
        .registerParser('license', String)
        .registerBuilder('license', function(tag, curJsdocNode) {
            curJsdocNode.license = tag.content;
        });
};
