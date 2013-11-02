module.exports = function(jsdoc) {
    jsdoc.registerTagParser('alias', function(comment) {
        return { to : comment };
    });
};