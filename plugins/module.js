module.exports = function(jsdoc) {
    jsdoc
        .registerParser('module', function(comment) {
            return { name : comment };
        })
        .registerBuilder('module', function(tag, curJsdocNode) {
            var moduleNode = this.currentModule = {
                    jsdocType : 'module',
                    name : tag.name
                };
            (curJsdocNode.modules || (curJsdocNode.modules = [])).push(
                (this.modules || (this.modules = {}))[tag.name] = moduleNode);
            return moduleNode;
        })
        .registerPostprocessor('', function(jsdocNode, postprocess) {
            var jsType = jsdocNode.jsType;

            if(jsType) {
                if(this.classes && this.classes.hasOwnProperty(jsType)) {
                    var curModule = this.currentModule;
                    postprocess(
                        (curModule.classes || (curModule.classes = {}))[jsType] = this.classes[jsType]);
                }
            }
        });
};