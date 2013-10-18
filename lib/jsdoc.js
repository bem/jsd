module.exports = function(string) {
    var ast = require('./parser')(string),
        jsdoc = {};

    ast.iterate(function(astNode) {
        if(astNode.comments) {
            console.log(parseJSDocComment(astNode.comments.value));
        }
    });
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
        var matches = line.match(/^(?:\*|\s)*@(\w+)(?:\s+(.+))*$/);
        if(matches) {
            if(!descriptionParsed) {
                description && tags.push(parseJSDocCommentTags.description(description));
                descriptionParsed = true;
            }

            var tagName = matches[1],
                parse = parseJSDocCommentTags[tagName];
            if(!parse) {
                console.log('Unsupported tag: ', tagName);
                return;
            }
            var tag = parse(matches[2]);
            tag.type = tagName;
            tags.push(tag);
        }
        else {
            descriptionParsed || (description += (description ? '\n' : '') + line);
        }
    });

    return tags;
}

var parseJSDocCommentTags = {
    'alias' : function(comment) {
        return { to : comment };
    },

    'class' : function(comment) {
        return { name : comment };
    },

    'description' : function(comment) {
        return { description : comment }; // TODO: надо это еще допарсить
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
        var match = comment.match(/^(?:{([^}]+)}\s+)?([^\s]+)\s*(.*?)\s*$/),
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
        var match = comment.match(/^(?:{([^}]+)})/);
        return { jsType : match[1] };
    }
};

var INHERIT = require('inherit'),

    ModuleNode = INHERIT({
            __constructor : function() {
                this.name = '';
                this.description = '';
                this.exports = [];
            }
        }, {
            type : 'module'
        }),

    ClassNode = INHERIT({
            __constructor : function() {
                this.name = '';
                this.description = '';
                this.static = [];
                this.dynamic = [];
                this.augment = '';
                this.mixes = [];
                this.mixin = false;
            }
        }, {
            type : 'class'
        }),

    FunctionNode = INHERIT({
            __constructor : function() {
                this.name = '';
                this.description = '';
                this.params = [];
                this.returns = undefined;
            }
        }, {
            type : 'function'
        }),

    ObjectNode = INHERIT({
            __constructor : function() {
                this.name = '';
                this.description = '';
                this.fields = [];
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
            __constructor : function() {
                this.name = '';
                this.description = '';
                this.jsType = '';
                this.optional = false;
                this.default = undefined;
            }
        }, {
            type : 'param'
        }),

    ReturnsNode = INHERIT({
            __constructor : function() {
                this.name = '';
                this.description = '';
                this.jsType = '';
            }
        }, {
            type : 'returns'
        });