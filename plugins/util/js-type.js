exports.parse = function parse(str) {
    if(!str.match(/[\w:*|\[\]]+/)) throw Error('Unsupported symbols in jsType: ' + str);

    var hasPipes = str.indexOf('|') > -1,
        hasBrackets = str.indexOf('[') > -1;

    if(!hasPipes && !hasBrackets) return str;

    var piped = str.split('|');
    if(!hasBrackets) return piped;

    // TODO: complex case https://github.com/bem/jsdoc/issues/49

    var res = piped.map(function(jsType) {
        var matches = jsType.match(/([^\[]+)(?:\[([^\]]+)\])?/);
        if(!matches) throw Error('Can\'t parse jsType: ' + jsType);
        if(matches[2]) {
            return { jsType : matches[1], of : matches[2] };
        } else return matches[1];
    });

    return res.length === 1? res[0] : res;
};

exports.iterate = function iterate(jsType, fn, ctx) {
    if(!jsType) return;

    if(typeof jsType === 'string') {
        fn.call(ctx, jsType);
    } else if(Array.isArray(jsType)) {
        jsType.forEach(function(jsType) {
            iterate(jsType, fn, ctx);
        });
    } else if(typeof jsType === 'object') {
        iterate(jsType.jsType, fn, ctx);
        iterate(jsType.of, fn, ctx);
    } else
        throw Error('Unsupported jsType: ' + jsType);
};
