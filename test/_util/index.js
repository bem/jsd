require('chai').should();

var JSDOC = require('../../lib/jsdoc'),
    FS = require('fs'),
    PATH = require('path'),
    PRJ_ROOT = PATH.join(__dirname, '..', '..');

exports.testPlugins = function(testFile, plugins) {
    var jsdoc = new JSDOC();
    (
        plugins ||
        [
            'module',
            'class',
            'event',
            'type',
            'exports',
            'description',
            'constructor',
            'access-level',
            'augments',
            'const',
            'deprecated',
            'param',
            'returns',
            'example'
        ]
    ).forEach(function(plugin) {
        jsdoc.registerPlugin(PATH.join(PRJ_ROOT, 'plugins', plugin));
    });

    var baseName = PATH.basename(testFile, '.js');

    describe(baseName, function() {
        FS.readdirSync(PATH.join(PATH.dirname(testFile), baseName)).forEach(function(fileName) {
            if(PATH.extname(fileName) === '.js') {
                var dirName = PATH.join(__dirname, '..', baseName),
                    jsFileName = PATH.join(dirName, fileName),
                    jsonFileName = PATH.join(dirName, fileName.replace(/\.js$/, '.json')),
                    resFileName = PATH.join(dirName, fileName.replace(/\.js$/, '.res.json'));

                it(
                    PATH.relative(PRJ_ROOT, jsFileName) +
                        ' should be parsed as expected in ' +
                        PATH.relative(PRJ_ROOT, jsonFileName),
                    function() {
                        // NOTE: JSON.parse(JSON.stringify(...)) because of Chai.js bug
                        var res = JSON.stringify(jsdoc.doIt(FS.readFileSync(jsFileName, 'utf-8')), null, 4);
                        FS.writeFileSync(resFileName, res);
                        JSON.parse(res).should.be.eql(
                            JSON.parse(FS.readFileSync(jsonFileName)),
                            'Result file: ' + resFileName);
                    }
                );
            }
        });
    });
};
