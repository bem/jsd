module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('const', function() {
            return {};
        })
        .registerTagBuilder('const', function(tag, jsdocNode) {
            jsdocNode.isConst = true;
        });
};
