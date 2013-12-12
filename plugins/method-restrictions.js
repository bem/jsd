module.exports = function(jsdoc) {
    jsdoc
        .registerParser(['abstract', 'override', 'final'], Boolean)
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
