module.exports = function(jsdoc) {
    jsdoc
        .registerParser('constructor', function() {
            return {};
        })
        .registerBuilder('constructor', function(tag, curJsdocNode) {
            curJsdocNode.isConstructor = true;
        });
};
