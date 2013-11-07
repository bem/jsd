module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('const', function() {
            return {};
        })
        .registerTagsEndBuilder(function(tags, jsdocNode) {
            tags.hasTagByType('const') && (jsdocNode.isConst = true);
        });
};
