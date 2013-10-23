module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc
        .registerTag('param', function(comment) {
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
        .registerNode('param', INHERIT({
            __constructor : function(name, description, jsType, isOptional, def) {
                this.name = name;
                this.description = description;
                this.jsType = jsType;
                this.isOptional = isOptional;
                this.default = def;
            }
        }, {
            type : 'param'
        }))
        .registerBuilder(
            function(tag) {
                tag.type === 'param' &&
                    this.jsdocNode.addParam(
                        jsdoc.createNode(
                            'param',
                            tag.name,
                            tag.description,
                            tag.jsType,
                            tag.isOptional,
                            tag.default));
            });
};
