var JSPATH = require('jspath');

module.exports = function(jsdoc) {
    jsdoc
        .registerParser('bem', function(comment) {
            var matches = comment.match(/([a-zA-Z0-9-]+)(?:__([a-zA-Z0-9-]+))?(?:_([a-zA-Z0-9-]+)(?:_([a-zA-Z0-9-_]+))?)?/) || [],
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
        .registerBuilder('bem', function(tag, curJsdocNode, _, astNode) {
            if(curJsdocNode.jsdocType !== 'class') throw Error('@bem can be mixed with @class only');

            curJsdocNode.bem = tag.block?
               {
                    jsdocType : 'bem',
                    block : tag.block,
                    elem : tag.elem,
                    modName : tag.modName,
                    modVal : tag.modVal
                } :
                parseBEMFromAST(astNode);
        })
        .registerBuilder('bemmod', function(tag, curJsdocNode) {
            var curMod = this.curMod = {
                    jsdocType : 'bemmod',
                    mod : tag.mod,
                    description : tag.description
                },
                bem = curJsdocNode.bem;
            (bem.mods || (bem.mods = [])).push(curMod);
        })
        .registerBuilder('bemval', function(tag) {
            (this.curMod.vals || (this.curMod.vals = [])).push({
                jsdocType : 'bemval',
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

function parseBEMFromAST(astNode) {
    astNode = JSPATH(
        '.{.type === "ExpressionStatement"}' +
            '.expression{.type === "CallExpression"}' +
                '.arguments[0]',
        astNode);

    var bem = { jsdocType : 'bem' };

    if(astNode && astNode.type === 'Literal')
        bem.block = astNode.value;
    else if(astNode && astNode.type === 'ObjectExpression') {
        astNode.properties.forEach(function(prop) {
            var name = prop.key.value || prop.key.name,
                valueNode = prop.value;
            if(valueNode.type === 'Literal')
                bem[name] = valueNode.value;
            else if(name === 'modVal' && valueNode.type === 'ArrayExpression') {
                bem[name] = valueNode.elements.map(function(itemNode) {
                    if(itemNode.type === 'Literal') return itemNode.value;
                        else throw Error('Can\'t implicit parse BEM modifier values from source, use explicit @bem tag.');
                });
            } else
                throw Error('Can\'t implicit parse BEM ' + name + ' from source, use explicit @bem tag.');
        });
    } else
        throw Error('Can\'t implicit parse BEM item from source, use explicit @bem tag.');

    return bem;
}
