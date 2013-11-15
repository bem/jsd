module.exports = function(jsdoc) {
    jsdoc
        .registerParser('protected', function() {
            return {};
        })
        .registerBuilder('protected', function(tag, curJsdocNode) {
            curJsdocNode.isProtected = true;
        });
};
