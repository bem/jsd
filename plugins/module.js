module.exports = function(jsdoc) {
    jsdoc
        .registerParser('module', String)
        .registerBuilder('module', function(tag, curJsdocNode) {
            var moduleNode = this.currentModule = {
                    jsdocType : 'module',
                    name : tag.content
                };
            (curJsdocNode.modules || (curJsdocNode.modules = [])).push(
                (this.modules || (this.modules = {}))[tag.content] = moduleNode);
            return moduleNode;
        })
        .registerPostprocessor(function(jsdocNode, postprocess) {
            var classes = this.classes;
            classes && require('./util/js-type').iterate(
                jsdocNode.jsType,
                function(jsType) {
                    if(classes.hasOwnProperty(jsType)) {
                        var curModule = this.currentModule;
                        postprocess(
                            (curModule.classes || (curModule.classes = {}))[jsType] = classes[jsType]);
                    }
                }, this);
        });
};
