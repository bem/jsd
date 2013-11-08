module.exports = function(jsdoc) {
    jsdoc.registerParser('alias', function(comment) {
        return { to : comment };
    });
};