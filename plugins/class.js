module.exports = function(jsdoc) {
    jsdoc
        .registerTag('class', function(comment) {
            return { name : comment };
        })
        .registerTag('lends', function(comment) {
            return { to : comment };
        })
        .registerBuilder(
            function(tag) {
                switch(tag.type) {
                    case 'class':
                        return (this.classes || (this.classes = {}))[tag.name] = {
                            type : 'class',
                            name : tag.name,
                            'static' : {},
                            proto : {}
                        };

                    case 'lends':
                        var matches = tag.to.split('.');
                        return this.classes
                            [matches[0]]
                            [matches[matches.length - 1] === 'prototype'?
                                'proto' :
                                'static'];
                }
            });
};
