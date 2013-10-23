module.exports = function(jsdoc) {
    jsdoc.registerTag('alias', function(comment) {
        return { to : comment };
    });
};