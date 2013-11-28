require('chai').should();

var FS = require('fs'),
    PATH = require('path'),
    PRJ_ROOT = PATH.join(__dirname, '..', '..');

exports.testPlugins = function(testFile, prjRoot, plugins) {
    var jsdoc = require('../../lib/jsdoc')(plugins || [PATH.join(PRJ_ROOT, 'plugins', 'description')]),
        baseName = PATH.basename(testFile, '.js');

    describe(baseName, function() {
        prjRoot || (prjRoot = PRJ_ROOT);
        var testFileDirName = PATH.dirname(testFile);
        FS.readdirSync(PATH.join(testFileDirName, baseName)).forEach(function(fileName) {
            if(PATH.extname(fileName) === '.js') {
                var dirName = PATH.join(testFileDirName, baseName),
                    jsFileName = PATH.join(dirName, fileName),
                    jsonFileName = PATH.join(dirName, fileName.replace(/\.js$/, '.json')),
                    resFileName = PATH.join(dirName, fileName.replace(/\.js$/, '.res.json'));

                it(
                    PATH.relative(prjRoot, jsFileName) +
                        ' should be parsed as expected in ' +
                        PATH.relative(prjRoot, jsonFileName),
                    function() {
                        // NOTE: JSON.parse(JSON.stringify(...)) because of Chai.js bug
                        var res = JSON.stringify(jsdoc(FS.readFileSync(jsFileName, 'utf-8')), null, 4);
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
