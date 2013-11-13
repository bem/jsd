module.exports = function(jsdoc) {
    jsdoc
        .registerParser('deprecated', function(comment) {
            return { description : comment };
        })
        .registerBuilder('deprecated', function(tag, curJsdocNode) {
            curJsdocNode.deprecated = {
                type : 'deprecated',
                description : tag.description
            };
        });
};
