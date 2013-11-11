module.exports = function(jsdoc) {
    jsdoc
        .registerParser('const', function() {
            return {};
        })
        .registerBuilder('const', function(tag, curJsdocNode) {
            curJsdocNode.isConst = true;
        });
};
