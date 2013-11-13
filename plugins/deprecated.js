module.exports = function(jsdoc) {
    jsdoc
        .registerParser('deprecated', function() {
            return {};
        })
        .registerBuilder('deprecated', function(tag, curJsdocNode) {
            curJsdocNode.isDeprecated = true;
        });
};
