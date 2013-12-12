module.exports = function(jsdoc) {
    jsdoc
        .registerParser('augments', String)
        .registerBuilder('augments', function(tag, curJsdocNode) {
            curJsdocNode.augments = { jsdocType : 'type', jsType : tag.content };
        });
};