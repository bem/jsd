module.exports = function(jsdoc) {
    jsdoc
        .registerParser('deprecated', String)
        .registerBuilder('deprecated', function(tag, curJsdocNode) {
            curJsdocNode.deprecated = {
                jsdocType : 'deprecated',
                description : tag.content
            };
        });
};
