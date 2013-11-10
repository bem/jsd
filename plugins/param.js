module.exports = function(jsdoc) {
    jsdoc
        .registerParser('param', function(comment) {
            var match = comment.match(/^(?:{([^}]+)}\s+)?(\S+)\s*(.*?)\s*$/),
                name = match[2],
                isOptional = name[0] === '[',
                defaultVal;

            if(isOptional) {
                name = name.substr(1, name.length - 2);
                if(name.indexOf('=') > -1) {
                    var splitted = name.split('=');
                    name = splitted[0];
                    defaultVal = splitted[1];
                }
            }

            return {
                jsType : match[1],
                name : name,
                description : match[3],
                isOptional : isOptional,
                'default' : defaultVal
            };
        })
        .registerBuilder('param', function(tag, jsdocNode) {
            if(jsdocNode.jsType !== 'function') {
                throw Error('@param without function');
            }

            (jsdocNode.params || (jsdocNode.params = [])).push(
                {
                    type : 'param',
                    name : tag.name,
                    description : tag.description,
                    jsType : tag.jsType,
                    isOptional : tag.isOptional,
                    'default' : tag.default
                });
        });
};
