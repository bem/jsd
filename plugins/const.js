module.exports = function(jsdoc) {
    jsdoc
        .registerParser('const', function() {
            return {};
        })
        .registerBuilder('const', function(tag, jsdocNode) {
            jsdocNode.isConst = true;
        });
};
