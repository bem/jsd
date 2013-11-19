module.exports = function(jsdoc) {
    jsdoc
        .registerParser('author', function(comment) {
            var matches = comment.match(/\s*([^<]+)(<[^>\s]+>)?/);
            return {
                name : matches[1].trim(),
                email : matches[2]
            };
        })
        .registerBuilder('author', function(tag, curJsdocNode) {
            curJsdocNode.author = {
                name : tag.name,
                email : tag.email
            };
        });
};