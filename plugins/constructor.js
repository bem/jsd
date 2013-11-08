module.exports = function(jsdoc) {
    jsdoc
        .registerParser('constructor', function() {
            return {};
        })
        .registerBuilder('constructor', function(tag, jsdocNode) {
            jsdocNode.isConstructor = true;
        });
};
