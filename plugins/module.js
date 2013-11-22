module.exports = function(jsdoc) {
    jsdoc
        .registerParser('module', function(comment) {
            return { name : comment };
        })
        .registerBuilder('module', function(tag, curJsdocNode) {
            var moduleNode = this.currentModule = {
                    jsdocType : 'module',
                    name : tag.name,
                    toJSON : toJSONFactory(this)
                };
            (curJsdocNode.modules || (curJsdocNode.modules = [])).push(
                (this.modules || (this.modules = {}))[tag.name] = moduleNode);
            return moduleNode;
        });
};

function toJSONFactory(ctx) {
    return function toJSON() {
        iterateAndSaveClassesFactory(ctx, this)(this.exports);
        return this;
    };
}

function iterateAndSaveClassesFactory(ctx, moduleNode) {
    return function iterateAndSaveClasses(jsdocNode) {
        if(!jsdocNode) return;

        var jsType = jsdocNode.jsType;

        if(jsType) {
            if(ctx.classes && ctx.classes.hasOwnProperty(jsType)) {
                (moduleNode.classes || (moduleNode.classes = {}))[jsType] = ctx.classes[jsType];
                iterateAndSaveClasses(ctx.classes[jsType]);
            }
        }

        for(var i in jsdocNode) {
            if(jsdocNode.hasOwnProperty(i)) {
                var prop = jsdocNode[i];
                if(prop && typeof prop === 'object') {
                    Array.isArray(prop)?
                        prop.forEach(iterateAndSaveClasses) :
                        iterateAndSaveClasses(prop);
                }
            }
        }
    }
}