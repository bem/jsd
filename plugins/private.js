module.exports = function(jsdoc) {
    jsdoc
        .registerParser('private', function() {
            return {};
        })
        .registerBuilder('private', function(tag, curJsdocNode) {
            curJsdocNode.isPrivate = true;
        });
};
