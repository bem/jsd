module.exports = function(jsdoc) {
    jsdoc
        .registerParser('class', function(comment) {
            return { name : comment };
        })
        .registerParser('lends', function(comment) {
            return { to : comment };
        })
        .registerBuilder('class', function(tag) {
            return addClassNode(this, tag.name);
        })
        .registerBuilder('lends', function(tag) {
            var matches = tag.to.split('.');
            return addClassNode(this, matches[0])
                [matches[matches.length - 1] === 'prototype'?
                    'proto' :
                    'static'];
        });
};

function addClassNode(ctx, name) {
    var classes = ctx.classes || (ctx.classes = {});
    return classes[name] || (classes[name] = {
        type : 'class',
        name : name,
        'static' : { type : 'type', jsType : 'Object', props : {} },
        proto : { type : 'type', jsType : 'Object', props : {} }
    });
}