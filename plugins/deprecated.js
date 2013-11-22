module.exports = function(jsdoc) {
    jsdoc
        .registerParser('deprecated', function(comment) {
            return { description : comment };
        })
        .registerBuilder('deprecated', function(tag, curJsdocNode) {
            curJsdocNode.deprecated = {
                jsdocType : 'deprecated',
                description : tag.description
            };
        });
};
