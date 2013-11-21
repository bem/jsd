module.exports = function(jsdoc) {
    jsdoc
        .registerParser('bem', function(comment) {
            var matches = comment.match(/([a-zA-Z0-9-]+)(?:__([a-zA-Z0-9-]+))?(?:_([a-zA-Z0-9-]+)(?:_([a-zA-Z0-9-_]+))?)?/),
                val = matches[4] && matches[4].split('_');
            return {
                block : matches[1],
                elem : matches[2],
                modName : matches[3],
                modVal : val && (val.length > 1? val : val[0])
            };
        })
        .registerParser('bemmod', function(comment) {
            var matches = comment.match(/^(?:(\S+)\s*)(.*?)?\s*$/);
            return {
                mod : matches[1],
                description : matches[2]
            };
        })
        .registerParser('bemval', function(comment) {
            var matches = comment.match(/^(?:(\S+)\s*)(.*?)?\s*$/);
            return {
                val : matches[1],
                description : matches[2]
            };
        })
        .registerBuilder('bem', function(tag, curJsdocNode) {
            if(curJsdocNode.type !== 'class') throw Error('@bem can be mixed with @class only');

            curJsdocNode.bem = {
                type : 'bem',
                block : tag.block,
                elem : tag.elem,
                modName : tag.modName,
                modVal : tag.modVal
            };
        })
        .registerBuilder('bemmod', function(tag, curJsdocNode) {
            var curMod = this.curMod = {
                    type : 'bemmod',
                    mod : tag.mod,
                    description : tag.description
                },
                bem = curJsdocNode.bem;
            (bem.mods || (bem.mods = [])).push(curMod);
        })
        .registerBuilder('bemval', function(tag) {
            (this.curMod.vals || (this.curMod.vals = [])).push({
                type : 'bemval',
                val : tag.val,
                description : tag.description
            });
        })
        .registerBuilder('param', function(tag, curJsdocNode) {
            var bem = curJsdocNode.bem;
            if(bem) {
                // take out param from class node
                (bem.params || (bem.params = [])).push(curJsdocNode.params.shift());
                // and delete params from class (@param can be used for @bem not for @class)
                if(!curJsdocNode.params.length) delete curJsdocNode.params;
            }
        });
};
