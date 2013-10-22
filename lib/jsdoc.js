var EYES = require('eyes').inspector({ maxLength : 1000000 });

module.exports = function(string) {
    var source = require('./parser')(string),
        jsdoc = [],
        modules = {},
        classes = {};

    EYES(source);
    source.iterate(function(astNode, jsdocNode) {
        if(astNode.comments) {
            var tags = parseJSDocComment(astNode.comments.value),
                isFunction = false;
            console.log(tags);
            tags.forEach(function(tag) {
                tag.type === 'module' &&
                    jsdoc.push(jsdocNode = modules[tag.name] = new ModuleNode(tag.name));

                tag.type === 'description' && (jsdocNode.description = tag.content);

                tag.type === 'class' && (jsdocNode = classes[tag.name] = new ClassNode(tag.name));

                if(tag.type === 'alias') {
                    if(tag.module) {
                        modules[tag.module].addExport(new ExportNode(tag.to, jsdocNode));
                    } else if(modules.hasOwnProperty(tag.to)) {
                        modules[tag.to].exports = jsdocNode;
                    }
                }

                if(tag.type === 'lends') {
                    var matches = tag.to.split('.');
                    // TODO: refactor
                    if(matches[matches.length - 1] === 'prototype') {
                        jsdocNode = classes[matches[0]].proto;
                    } else {
                        jsdocNode = classes[matches[0]].static;
                    }
                }

                if(tag.type === 'param') {
                    if(!isFunction) {
                        isFunction = true;
                        var name;
                        if(astNode.type === 'Property') {
                            name = astNode.key.value || astNode.key.name // assume Literal and Identifier key node types
                        } else {
                            throw new Error('Unsupported function declaration: ' + astNode.type);
                        }
                        jsdocNode.addField(jsdocNode = new FunctionNode(name));
                    }
                    jsdocNode.addParam(new ParamNode(tag.name, tag.description, tag.jsType, tag.isOptional, tag.default));
                }

                if(tag.type === 'returns') {
                    jsdocNode.returns = new ReturnsNode(tag.description, tag.jsType);
                }
            });
        }
        return jsdocNode
    });
    console.log('JSDoc: ');
    EYES(jsdoc);
};

/**
 * Parse all tags from JSDoc comment string
 * @param {String} comment comment string
 * @returns {Array[Object]} JSDoc tags
 */
function parseJSDocComment(comment) {
    var tags = [],
        lines = comment.split('\n'),
        description = '',
        descriptionParsed = false;

    lines.forEach(function(line) {
        var matches = line.match(/^(?:\*|\s)*@(\w+)(?:\s+(.+?)\s*)?$/);
        if(matches) {
            if(!descriptionParsed) {
                descriptionParsed = true;
            }

            try {
                tags.push(parseTagComment(matches[1], matches[2]));
            }
            catch(e) {
                console.info(e.message);
            }
        }
        else if(!descriptionParsed) {
            var trimmedLine = line.replace(/^[\s*]+/, '');
            trimmedLine && (description += (description? '\n' : '') + trimmedLine);
        }
    });

    if(descriptionParsed && description) {
        tags.push(parseTagComment('description', description));
    }

    return tags;
}

function parseTagComment(tagType, comment) {
    var parse = parseJSDocCommentTags[tagType];
    if(!parse) {
        throw Error('Unsupported tag: ' + tagType)
    }

    var res = parse(comment);
    res.type = tagType;
    return res;
}

var parseJSDocCommentTags = {
    'alias' : function(comment) {
        var tag = {},
            matches = comment.split(':');
        matches.length === 2 && (tag.module = matches.shift(matches));
        tag.to = matches[0];
        return tag;
    },

    'class' : function(comment) {
        return { name : comment };
    },

    'description' : function(comment) {
        return { content : comment };
    },

    'lends' : function(comment) {
        return { to : comment };
    },

    'mixes' : function(comment) {
        return { mixes : comment };
    },

    'mixin' : function(comment) {
        return {};
    },

    'module' : function(comment) {
        return { name : comment };
    },

    'param' : function(comment) {
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
    },

    'returns' : function(comment) {
        var match = comment.match(/^(?:{([^}]+)}\s*)?(.*?)\s*$/);
        return {
            jsType : match[1],
            description : match[2]
        };
    },

    'type' : function(comment) {
        var match = comment.match(/^{([^}]+)}/);
        return { jsType : match[1] };
    }
};

var INHERIT = require('inherit'),

    ModuleNode = INHERIT({
            __constructor : function(name) {
                this.name = name;
                this.description = '';
                this.exports = [];
            },

            addExport : function(node) {
                this.exports.push(node);
            }
        }, {
            type : 'module'
        }),

    ExportNode = INHERIT({
            __constructor : function(name, content) {
                this.name = name;
                this.content = content;
            }
        }, {
            type : 'export'
        }),

    ClassNode = INHERIT({
            __constructor : function(name) {
                this.name = name;
                this.description = '';
                this.static = new ObjectNode();
                this.proto = new ObjectNode();
                this.augment = '';
                this.mixes = [];
                this.mixin = false;
            }
        }, {
            type : 'class'
        }),

    FunctionNode = INHERIT({
            __constructor : function(name) {
                this.name = name;
                this.description = '';
                this.params = [];
                this.returns = undefined;
            },

            addParam : function(param) {
                this.params.push(param);
            }
        }, {
            type : 'function'
        }),

    ObjectNode = INHERIT({
            __constructor : function() {
                this.fields = [];
            },

            addField : function(node) {
                this.fields.push(node);
            }
        }, {
            type : 'object'
        }),

    ValueNode = INHERIT({
            __constructor : function() {
                this.name = '';
                this.description = '';
                this.jsType = '';
            }
        }, {
            type : 'value'
        }),

    ParamNode = INHERIT({
            __constructor : function(name, description, jsType, isOptional, def) {
                this.name = name;
                this.description = description;
                this.jsType = jsType;
                this.isOptional = isOptional;
                this.default = def;
            }
        }, {
            type : 'param'
        }),

    ReturnsNode = INHERIT({
            __constructor : function(description, jsType) {
                this.description = description;
                this.jsType = jsType;
            }
        }, {
            type : 'returns'
        });
