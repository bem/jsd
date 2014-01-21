var Tags = require('./tags'),
    parser = require('./parser'),
    inherit = require('inherit');
/**
 * API
 * @param {Array} plugins
 * @returns {Function}
 */
module.exports = function(plugins) {
    var jsdoc = new JSDoc(plugins);
    return function(str) {
        return jsdoc.parse(str);
    };
};

var JSDoc = inherit({
    __constructor : function(plugins) {
        this._tagParsers = {};
        this._tagBuilders = [];
        this._postprocessors = {};

        plugins.forEach(this._registerPlugin, this);
    },

    _registerPlugin : function(plugin) {
        (typeof plugin === 'string'? require(plugin) : plugin)(this);
        return this;
    },

    registerParser : function(tagType, parseFn) {
        if(Array.isArray(tagType)) {
            tagType.forEach(
                function(tagType) {
                    this.registerParser(tagType, parseFn);
                },
                this);
            return this;
        }

        tagType = escapeKey(tagType);
        this._tagParsers[tagType] = parseFn === Boolean || parseFn === String?
            simpleParsers[parseFn.name] :
            parseFn;
        return this;
    },

    registerBuilder : function(tagType, builderFn) {
        if(typeof tagType === 'function') {
            builderFn = tagType;
            tagType = null;
        }
        else if(Array.isArray(tagType)) {
            tagType.forEach(
                function(tagType) {
                    this.registerBuilder(tagType, builderFn);
                },
                this);
            return this;
        }

        this._tagBuilders.push({ type : tagType, fn : builderFn });
        return this;
    },

    registerPostprocessor : function(jsdocType, postprocessorFn) {
        if(Array.isArray(jsdocType)) {
            jsdocType.forEach(
                function(jsdocType) {
                    this.registerPostprocessor(jsdocType, postprocessorFn);
                },
                this);
            return this;
        }

        if(arguments.length === 1) {
            postprocessorFn = jsdocType;
            jsdocType = '';
        }

        jsdocType = escapeKey(jsdocType);
        (this._postprocessors[jsdocType] || (this._postprocessors[jsdocType] = [])).push(postprocessorFn);
        return this;
    },

    parse : function(source) {
        var sourceTree = parser(source),
            rootJsdocNode = { jsdocType : 'root' },
            ctx = {},
            _this = this;

        sourceTree.iterate(
            function(astNode, jsdocNode) {
                var accJsdocNode = jsdocNode;
                astNode.comments.forEach(function(commentAstNode) {
                    try {
                        accJsdocNode = _this._onIterate(ctx, commentAstNode, astNode, jsdocNode);
                    }
                    catch(e) {
                        throw _this._buildError(e, source, commentAstNode);
                    }
                });

                return accJsdocNode;
            },
            rootJsdocNode);

        this._postprocess(rootJsdocNode, ctx);

        return rootJsdocNode;
    },

    _onIterate : function(ctx, commentAstNode, astNode, jsdocNode) {
        var accJsdocNode = jsdocNode,
            parentJsdocNode = jsdocNode,
            tags = new Tags(this._parseJSDocComment(commentAstNode.value));

        this._tagBuilders.forEach(function(tagBuilder) {
            if(!tagBuilder.type) {
                var res = tagBuilder.fn.call(ctx, tags, accJsdocNode, parentJsdocNode, astNode);
                typeof res !== 'undefined' && (accJsdocNode = res);
                return;
            }

            tags.getTagsByType(tagBuilder.type).forEach(function(tag) {
                var res = tagBuilder.fn.call(ctx, tag, accJsdocNode, parentJsdocNode, astNode);
                typeof res !== 'undefined' && (accJsdocNode = res);
            });
        });

        return accJsdocNode;
    },

    _parseJSDocComment : function(comment) {
        var tags = [],
            lines = comment.replace(/^(\s*\*)?[\s\n]*|[\s\n]*$/g, '').split('\n'),
            tag = { type : '', comment : '' };

        lines.forEach(function(line, i) {
            var matches = line.match(/^(?:\*|\s)*@(\w+)(?:\s+(.+?)\s*)?$/);
            if(matches) {
                tag.type && tags.push(this._parseTagComment(tag));
                tag.type = matches[1];
                tag.comment = matches[2] || '';
            } else {
                i || (tag.type = 'description');
                tag.comment += (tag.comment? '\n' : '') + line.replace(/^\s*\*\s?|\s*$/g, '');
            }
        }, this);
        tags.push(this._parseTagComment(tag));

        return tags;
    },

    _parseTagComment : function(tag) {
        var parse = this._tagParsers[escapeKey(tag.type)];
        if(!parse) {
            throw Error('Unsupported tag: ' + tag.type);
        }

        var res = parse(tag.comment.replace(/\n*$/g, ''));
        res.type = tag.type;
        return res;
    },

    iterate : function(jsdocNode, cb, ctx) {
        function iterate(jsdocNode) {
            if(!jsdocNode) return;

            jsdocNode.jsdocType && cb.call(ctx, jsdocNode);

            for(var i in jsdocNode) {
                if(jsdocNode.hasOwnProperty(i)) {
                    var prop = jsdocNode[i];
                    if(prop && typeof prop === 'object') {
                        Array.isArray(prop)?
                            prop.forEach(iterate) :
                            iterate(prop);
                    }
                }
            }
        }

        iterate(jsdocNode);
    },

    _postprocess : function(rootJsdocNode, ctx) {
        var _this = this,
            processedJsdocNodes = [],
            postprocessCb = function(jsdocNode) {
                _this.iterate(rootJsdocNode, function(jsdocNode) {
                    if(!jsdocNode._postprocessed) {
                        jsdocNode._postprocessed = true;
                        processedJsdocNodes.push(jsdocNode);
                        _this._postprocessByType(jsdocNode.jsdocType, jsdocNode, ctx, postprocessCb);
                        _this._postprocessByType('', jsdocNode, ctx, postprocessCb);
                    }
                });
            };

        postprocessCb(rootJsdocNode);

        processedJsdocNodes.forEach(function(jsdocNode) {
            delete jsdocNode._postprocessed;
        });
    },

    _postprocessByType : function(jsdocType, jsdocNode, ctx, postprocessCb) {
        var postprocessors = this._postprocessors[escapeKey(jsdocType)];
        postprocessors && postprocessors.forEach(function(fn) {
            fn.call(ctx, jsdocNode, postprocessCb);
        });
    },

    _buildError : function(e, source, commentAstNode) {
        var loc = commentAstNode.loc,
            msg = 'Error: "' + e.message + '" while processing jsdoc comments started at line ' + loc.start.line;

        return Error(
            msg + '\n' +
            new Array(msg.length + 1).join('-') + '\n' +
            source.split('\n').slice(loc.start.line - 1, loc.end.line + 3).join('\n') + '\n' +
            e.stack);
    }
});

var simpleParsers = {
        String : function(comment) {
            return { content : comment.trim() };
        },
        Boolean : function(comment) {
            return {};
        }
    };

function escapeKey(tagType) {
    return '_' + tagType;
}
