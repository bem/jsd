module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('constructor', function() {
            return {};
        })
        .registerTagBuilder('constructor', function(tag, jsdocNode) {
            jsdocNode.isConstructor = true;
        });
};
