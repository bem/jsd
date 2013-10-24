module.exports = function(jsdoc) {
    jsdoc
        .registerTag('returns', function(comment) {
            var match = comment.match(/^(?:{([^}]+)}\s*)?(.*?)\s*$/);
            return {
                jsType : match[1],
                description : match[2]
            };
        })
        .registerBuilder(
            function(tag, jsdocNode) {
                tag.type === 'returns' &&
                    (jsdocNode.returns = {
                        type : 'returns',
                        description : tag.description,
                        jsType : tag.jsType
                    });
            });
};
