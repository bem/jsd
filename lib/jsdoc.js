var Tags = require('./tags'),
    jsdoc = module.exports = function(string) {
        var source = require('./parser')(string),
            rootJsdocNode = { type : 'root' },
            ctx = {};

        source.iterate(
            function(astNode, jsdocNode) {
                var accJsdocNode = jsdocNode;
                if(astNode.comments) {
                    var tags = new Tags(parseJSDocComment(astNode.comments.value));
                    tagsBuilders.forEach(function(builder) {
                        var res = builder.call(ctx, tags, accJsdocNode, astNode);
                        typeof res !== 'undefined' && (accJsdocNode = res);
                    });

                    tags.forEach(function(tag) {
                        tagBuilders[tag.type] && tagBuilders[tag.type].forEach(function(builder) {
                            var res = builder.call(ctx, tag, accJsdocNode, astNode);
                            typeof res !== 'undefined' && (accJsdocNode = res);
                        });
                    });
                }
                return accJsdocNode;
            },
            rootJsdocNode);

        return rootJsdocNode;
    };

jsdoc.registerPlugin = function(plugin) {
    require(plugin)(jsdoc); // TODO: сделать что-то поумнее
    return jsdoc;
};

var parseTagFns = {};
jsdoc.registerTagParser = function(tagName, parseFn) {
    parseTagFns[tagName] = parseFn;
    return jsdoc;
};

var tagsBuilders = [];
jsdoc.registerTagsBuilder = function(builder) {
    tagsBuilders.push(builder);
    return jsdoc;
};

var tagBuilders = {};
jsdoc.registerTagBuilder = function(type, builder) {
    (tagBuilders[type] || (tagBuilders[type] = [])).push(builder);
    return jsdoc;
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

    lines.forEach(function(line, i) {
        var matches = line.match(/^(?:\*|\s)*@(\w+)(?:\s+(.+?)\s*)?$/);
        if(matches) {
            descriptionParsed || (descriptionParsed = true);
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

    if((descriptionParsed || !tags.length) && description) {
        tags.push(parseTagComment('description', description, true, true));
    }

    return tags;
}

function parseTagComment(tagType, comment) {
    var parse = parseTagFns[tagType];
    if(!parse) {
        throw Error('Unsupported tag: ' + tagType);
    }

    var res = parse(comment);
    res.type = tagType;
    return res;
}
