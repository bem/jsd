module.exports = function(jsdoc) {
    jsdoc
        .registerParser('augments', function(comment) {
            return { name : comment };
        })
        .registerBuilder('augments', function(tag, curJsdocNode) {
            curJsdocNode.augments = { jsdocType : 'type', jsType : tag.name };
        });
};