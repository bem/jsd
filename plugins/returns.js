module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('returns', function(comment) {
            var match = comment.match(/^(?:{([^}]+)}\s*)?(.*?)\s*$/);
            return {
                jsType : match[1],
                description : match[2]
            };
        })
        .registerTagBuilder('returns', function(tag, jsdocNode) {
            jsdocNode.returns = {
                type : 'returns',
                description : tag.description,
                jsType : tag.jsType
            };
        });
};
