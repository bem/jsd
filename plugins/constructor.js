module.exports = function(jsdoc) {
    jsdoc
        .registerTag('constructor', function() {
            return {};
        })
        .registerBuilder(function(tag, jsdocNode) {
            tag.type === 'constructor' && (jsdocNode.isConstructor = true);
        });
};
