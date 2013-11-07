var Tags = require('./tags'),
    parser = require('./parser'),
    JSDoc = module.exports = function() {
        this._tagParsers = {};
        this._tagsBuilders = [];
        this._tagBuilders = {};
    };

JSDoc.prototype = {
    registerPlugin : function(plugin) {
        require(plugin)(this); // TODO: сделать что-то поумнее
        return this;
    },

    registerTagParser : function(tagType, parseFn) {
        tagType = escapeTagType(tagType);
        this._tagParsers[tagType] = parseFn;
        return this;
    },

    registerTagsBuilder : function(builder) {
        this._tagsBuilders.push(builder);
        return this;
    },

    registerTagBuilder : function(tagType, builder) {
        tagType = escapeTagType(tagType);
        (this._tagBuilders[tagType] || (this._tagBuilders[tagType] = [])).push(builder);
        return this;
    },

    doIt : function(source) {
        var sourceTree = parser(source),
            rootJsdocNode = { type : 'root' },
            ctx = {},
            _this = this;

        sourceTree.iterate(
            function(astNode, jsdocNode) {
                var accJsdocNode = jsdocNode;
                if(astNode.comments) {
                    var tags = new Tags(_this._parseJSDocComment(astNode.comments.value));
                    _this._tagsBuilders.forEach(function(builder) {
                        var res = builder.call(ctx, tags, accJsdocNode, astNode);
                        typeof res !== 'undefined' && (accJsdocNode = res);
                    });

                    tags.forEach(function(tag) {
                        var tagType = escapeTagType(tag.type);
                        _this._tagBuilders[tagType] && _this._tagBuilders[tagType].forEach(function(builder) {
                            var res = builder.call(ctx, tag, accJsdocNode, astNode);
                            typeof res !== 'undefined' && (accJsdocNode = res);
                        });
                    });
                }
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
};

function escapeTagType(tagType) {
    return '-_-' + tagType;
}