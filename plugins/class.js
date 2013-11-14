module.exports = function(jsdoc) {
    jsdoc
        .registerParser('class', function(comment) {
            return { name : comment };
        })
        .registerParser('lends', function(comment) {
            return { to : comment };
        })
        .registerParser('member', function(comment) {
            var match = comment.match(/^(?:{([^}]+)}\s*)?(.*?)\s*$/);
            return {
                jsType : match[1],
                of : match[2]
            };
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
        })
        .registerBuilder('member', function(tag, curJsdocNode, parentNode, astNode) {
            console.log(astNode);
        });
};

function addClassNode(ctx, name) {
    var classes = ctx.classes || (ctx.classes = {});
    return classes[name] || (classes[name] = {
        type : 'class',
        name : name,
        'static' : { type : 'type', jsType : 'Object', props : {} },
        proto : { type : 'type', jsType : 'Object', props : {} },
        members : { type : 'type', jsType : 'Object', props : {} }
    });
}