module.exports = function(jsdoc) {
    jsdoc
        .registerTag('constructor', function() {
            return {};
        })
        .registerBuilder(function(tag) {
            tag.type === 'constructor' && (this.jsdocNode.isConstructor = true);
        });
};
