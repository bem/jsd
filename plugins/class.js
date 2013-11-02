module.exports = function(jsdoc) {
    jsdoc
        .registerTagParser('class', function(comment) {
            return { name : comment };
        })
        .registerTagParser('lends', function(comment) {
            return { to : comment };
        })
        .registerTagBuilder('class', function(tag) {
            return (this.classes || (this.classes = {}))[tag.name] = {
                type : 'class',
                name : tag.name,
                'static' : {},
                proto : {}
            };
        })
        .registerTagBuilder('lends', function(tag) {
            var matches = tag.to.split('.');
            return this.classes
                [matches[0]]
                [matches[matches.length - 1] === 'prototype'?
                    'proto' :
                    'static'];
        });
};
