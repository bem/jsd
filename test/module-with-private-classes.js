var U = require('./_util');

U.testPlugins(
    __filename,
    [
        'class',
        'module',
        'type',
        'exports',
        'alias',
        'description',
        'constructor',
        'const',
        'param',
        'returns'
    ]
);
