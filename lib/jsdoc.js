var jsdoc = module.exports = function(string) {
    var source = require('./parser')(string),
        rootJsdocNode = jsdoc.createNode('root'),
        ctx = { jsdocNode : rootJsdocNode, astNode : source };

    builders.forEach(function(builder) {
        builder.prepare && builder.prepare.call(ctx);
    });

    source.iterate(
        function(astNode, jsdocNode) {
            if(astNode.comments) {
                var tags = parseJSDocComment(astNode.comments.value);
                tags.forEach(function(tag) {
                    builders.forEach(function(builder) {
                        builder.build.call(ctx, tag, jsdocNode, astNode);
                    });
                });
            }
            return ctx.jsdocNode;
        },
        rootJsdocNode);

    return rootJsdocNode;
};

jsdoc.require = function(module) {
    return require(module);
};

var parseTagFns = {};
jsdoc.registerTag = function(tagName, parseFn) {
    parseTagFns[tagName] = parseFn;
    return jsdoc;
};

var nodeClasses = {};
jsdoc.registerNode = function(nodeName, nodeClass) {
    nodeClasses[nodeName] = nodeClass;
    return jsdoc;
};

jsdoc.createNode = function(nodeName, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10) {
    return new nodeClasses[nodeName](p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
};

var builders = [];
jsdoc.registerBuilder = function(prepare, build) {
    builders.push(arguments.length === 1?
        { build : prepare } :
        { build : build, prepare : prepare });
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
        descriptionParsed = false,
        isFirst = true;

    lines.forEach(function(line, i) {
        var matches = line.match(/^(?:\*|\s)*@(\w+)(?:\s+(.+?)\s*)?$/);
        if(matches) {
            descriptionParsed || (descriptionParsed = true);
            try {
                tags.push(parseTagComment(matches[1], matches[2], isFirst, i === lines.length - 1));
                isFirst = false;
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
        tags.push(parseTagComment('description', description, true, true));
    }

    return tags;
}

function parseTagComment(tagType, comment, isFirst, isLast) {
    var parse = parseTagFns[tagType];
    if(!parse) {
        throw Error('Unsupported tag: ' + tagType)
    }

    var res = parse(comment);
    res.type = tagType;
    res.isFirst = isFirst;
    res.isLast = isLast;
    return res;
}
