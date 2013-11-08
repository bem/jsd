module.exports = function(jsdoc) {
    jsdoc
        .registerParser('class', function(comment) {
            return { name : comment };
        })
        .registerParser('lends', function(comment) {
            return { to : comment };
        })
        .registerBuilder('class', function(tag) {
            return (this.classes || (this.classes = {}))[tag.name] = {
                type : 'class',
                name : tag.name,
                'static' : { type : 'type', jsType : 'Object', props : {} },
                proto : { type : 'type', jsType : 'Object', props : {} }
            };
        })
        .registerBuilder('lends', function(tag) {
            var matches = tag.to.split('.');
            return this.classes
                [matches[0]]
                [matches[matches.length - 1] === 'prototype'?
                    'proto' :
                    'static'];
        });
};


