var Tags = require('./tags'),
    parser = require('./parser'),
    inherit = require('inherit');

module.exports = inherit({
    __constructor : function() {
        this._tagParsers = {};
        this._tagBuilders = [];
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
            _this = this;

        sourceTree.iterate(
            function(astNode, jsdocNode) {
                try {
                    return _this._onIterate(ctx, astNode, jsdocNode);
                }
                catch(e) {
                    throw _this._buildError(e, source, astNode);
                }
            },
            rootJsdocNode);

        return rootJsdocNode;
    },

    _onIterate : function(ctx, astNode, jsdocNode) {
        var accJsdocNode = jsdocNode,
            parentJsdocNode = jsdocNode,
            tags = new Tags(this._parseJSDocComment(astNode.comments.value));

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
                tag.comment += (tag.comment? '\n' : '') + line.replace(/^\s*\*\s*|\s*$/g, '');
            }
        }, this);
        tags.push(this._parseTagComment(tag));

        return tags;
    },

    _parseTagComment : function(tag) {
        var parse = this._tagParsers[escapeTagType(tag.type)];
        if(!parse) {
            throw Error('Unsupported tag: ' + tag.type);
        }

        var res = parse(tag.comment);
        res.type = tag.type;
        return res;
    },

    _buildError : function(e, source, astNode) {
        var loc = astNode.comments.loc,
            msg = 'Error: "' + e.message + '" while processing jsdoc comments started at line ' + loc.start.line;

        return Error(
            msg + '\n' +
            new Array(msg.length + 1).join('-') + '\n' +
            source.split('\n').slice(loc.start.line - 1, loc.end.line + 3).join('\n') + '\n' +
            e.stack);
    }
});

function escapeTagType(tagType) {
    return '_' + tagType;
}
