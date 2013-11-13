module.exports = function(jsdoc) {
    jsdoc
        .registerParser('module', function(comment) {
            return { name : comment };
        })
        .registerBuilder('module', function(tag, curJsdocNode) {
            var moduleNode = {
                    type : 'module',
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

        var type = jsdocNode.type,
            jsType = jsdocNode.jsType;

        if(type === 'type' || type === 'param' || type === 'returns') {
            switch(jsType) {
                case 'Object':
                    for(var prop in jsdocNode.props) {
                        jsdocNode.props.hasOwnProperty(prop) &&
                            iterateAndSaveClasses(jsdocNode.props[prop]);
                    }
                break;

                case 'Function':
                    jsdocNode.params && jsdocNode.params.forEach(iterateAndSaveClasses);
                    iterateAndSaveClasses(jsdocNode.returns);
                break;

                default:
                    if(ctx.classes && ctx.classes.hasOwnProperty(jsType)) {
                        (moduleNode.classes || (moduleNode.classes = {}))[jsType] = ctx.classes[jsType];
                        iterateAndSaveClasses(ctx.classes[jsType]);
                    }
            }
        }
        else if(type === 'class') {
            iterateAndSaveClasses(jsdocNode.proto);
            iterateAndSaveClasses(jsdocNode.static);
            iterateAndSaveClasses(jsdocNode.augments);
        }
    }
}