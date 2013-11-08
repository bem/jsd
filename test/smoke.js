var U = require('./_util');

U.testPlugins(
    __filename,
    [
        'type',
        'class',
        'module',
        'alias',
        'description',
        'constructor',
        'const',
        'param',
        'returns'
    ]
);
