module.exports = function(jsdoc) {
    jsdoc
        .registerParser('final', function() {
            return {};
        })
        .registerBuilder('final', function(tag, curJsdocNode) {
            curJsdocNode.isFinal = true;
        });
};
