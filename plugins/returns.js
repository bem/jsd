module.exports = function(jsdoc) {
    jsdoc
        .registerParser('returns', function(comment) {
            var match = comment.match(/^(?:{([^}]+)}\s*)?(.*?)\s*$/);
            return {
                jsType : require('./util/js-type').parse(match[1]),
                description : match[2]
            };
        })
        .registerBuilder('returns', function(tag, curJsdocNode) {
            curJsdocNode.returns = {
                jsdocType : 'returns',
                description : tag.description,
                jsType : tag.jsType
            };
        });
};
