module.exports = function(jsdoc) {
    jsdoc
        .registerParser('const', Boolean)
        .registerBuilder('const', function(tag, curJsdocNode) {
            curJsdocNode.isConst = true;
        });
};
