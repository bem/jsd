module.exports = function(jsdoc) {
    jsdoc
        .registerParser('abstract', function() {
            return {};
        })
        .registerParser('override', function() {
            return {};
        })
        .registerParser('final', function() {
            return {};
        })
        .registerBuilder('abstract', function(tag, curJsdocNode) {
            curJsdocNode.isAbstract = true;
        })
        .registerBuilder('override', function(tag, curJsdocNode) {
            curJsdocNode.isOverridden = true;
        })
        .registerBuilder('final', function(tag, curJsdocNode) {
            curJsdocNode.isFinal = true;
        });

};
