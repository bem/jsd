var Tags = require('./tags'),
    parser = require('./parser'),
    inherit = require('inherit');

module.exports = inherit({
    __constructor : function() {
        this._tagParsers = {};
        this._tagBuilders = [];
        this._tagTypes = [];
    },

    registerPlugin : function(plugin) {
        require(plugin)(this); // TODO: сделать что-то поумнее
        return this;
    },

    registerParser : function(tagType, parseFn) {
        tagType = escapeTagType(tagType);
        this._tagParsers[tagType] = parseFn;
        return this;
    },

    registerBuilder : function(tagType, builder) {
        if(typeof tagType === 'function') {
            builder = tagType;
            tagType = null;
        }

        this._tagBuilders.push({ type : tagType, fn : builder });
        return this;
    },

    doIt : function(source) {
        var sourceTree = parser(source),
            rootJsdocNode = { type : 'root' },
            ctx = {},
            _this = this,
            tagBuilders = this._tagBuilders;

        sourceTree.iterate(
            function(astNode, jsdocNode) {
                var accJsdocNode = jsdocNode,
                    tags = new Tags(_this._parseJSDocComment(astNode.comments.value));

                tagBuilders.forEach(function(tagBuilder) {
                    if(!tagBuilder.type) {
                        var res = tagBuilder.fn.call(ctx, tags, accJsdocNode, astNode, accJsdocNode !== jsdocNode);
                        typeof res !== 'undefined' && (accJsdocNode = res);
                        return;
                    }

                    tags.getTagsByType(tagBuilder.type).forEach(function(tag) {
                        var res = tagBuilder.fn.call(ctx, tag, accJsdocNode, astNode, accJsdocNode !== jsdocNode);
                        typeof res !== 'undefined' && (accJsdocNode = res);
                    });
                });

                return accJsdocNode;
            },
            rootJsdocNode);

        return rootJsdocNode;
    },

    _parseJSDocComment : function(comment) {
        var tags = [],
            lines = comment.split('\n'),
            description = '',
            descriptionParsed = false;

        lines.forEach(function(line) {
            var matches = line.match(/^(?:\*|\s)*@(\w+)(?:\s+(.+?)\s*)?$/);
            if(matches) {
                descriptionParsed || (descriptionParsed = true);
                try {
                    tags.push(this._parseTagComment(matches[1], matches[2]));
                }
                catch(e) {
                    console.info(e.message);
                }
            }
            else if(!descriptionParsed) {
                var trimmedLine = line.replace(/^[\s*]+/, '');
                trimmedLine && (description += (description? '\n' : '') + trimmedLine);
            }
        }, this);

        if((descriptionParsed || !tags.length) && description) {
            tags.push(this._parseTagComment('description', description, true, true));
        }

        return tags;
    },

    _parseTagComment : function(tagType, comment) {
        var parse = this._tagParsers[escapeTagType(tagType)];
        if(!parse) {
            throw Error('Unsupported tag: ' + tagType);
        }

        var res = parse(comment);
        res.type = tagType;
        return res;
    }
});

function escapeTagType(tagType) {
    return '_' + tagType;
}