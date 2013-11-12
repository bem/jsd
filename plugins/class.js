module.exports = function(jsdoc) {
    jsdoc
        .registerParser('class', function(comment) {
            return { name : comment };
        })
        .registerParser('lends', function(comment) {
            return { to : comment };
        })
        .registerBuilder('class', function(tag) {
            var classes = this.classes || (this.classes = {});

            if(classes[tag.name]) throw Error('class ' + tag.name + ' is already defined');

            return classes[tag.name] = {
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


