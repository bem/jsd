require('chai').should();

var JSDOC = require('../lib/jsdoc'),
    FS = require('fs'),
    PATH = require('path');

[
    'module',
    'class',
    'alias',
    'function',
    'description',
    'constructor',
    'param',
    'returns'
].forEach(function(plugin) {
    JSDOC.registerPlugin(PATH.join(__dirname, '..', 'plugins', plugin));
});

describe('module-as-object', function() {
    var baseName = PATH.basename(__filename, '.js');
    FS.readdirSync(PATH.join(__dirname, baseName)).forEach(function(fileName) {
        if(PATH.extname(fileName) === '.js') {
            var dirName = PATH.join(__dirname, baseName),
                jsFileName = PATH.join(dirName, fileName);
            it(jsFileName + ' should be parsed as expected', function() {
                var res = JSON.stringify(JSDOC(FS.readFileSync(jsFileName)), null, 4);
                FS.writeFileSync(jsFileName + '.res', res);
                JSON.parse(res).should.be.eql(
                    JSON.parse(FS.readFileSync(PATH.join(dirName, fileName.replace(/\.js$/, '.json')))));
            });
        }
    });
});