module.exports = function(jsdoc) {
    jsdoc
        .registerParser(['private', 'protected', 'public'], function() {
            return {};
        })
        .registerBuilder(['private', 'protected', 'public'], function(tag, curJsdocNode) {
            curJsdocNode.accessLevel = tag.type;
        });
};
