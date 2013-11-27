exports.parse = function(str) {
    var types = str.split('|');
    return types.length > 1? types : types[0];
};

exports.iterate = function iterate(jsType, fn, ctx) {
    if(typeof jsType === 'string') {
        fn.call(ctx, jsType);
    } else if(Array.isArray(jsType)) {
        jsType.forEach(function(jsType) {
            iterate(jsType, fn, ctx);
        });
    }
};
