module.exports = function(jsdoc) {
    jsdoc
        .registerParser('augments', function(comment) {
            return { name : comment };
        })
        .registerBuilder('augments', function(tag, curJsdocNode) {
            curJsdocNode.augments = { type : 'type', jsType : tag.name };
        });
};