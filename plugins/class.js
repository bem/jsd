module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc
        .registerTag('class', function(comment) {
            return { name : comment };
        })
        .registerNode('class', INHERIT({
            __constructor : function(name) {
                this.name = name;
                this.description = '';
                this.static = jsdoc.createNode('object');
                this.proto = jsdoc.createNode('object');
                this.augment = '';
                this.mixes = [];
                this.mixin = false;
            }
        }, {
            type : 'class'
        }))
        .registerBuilder(
            function() {
                this.classes = {};
            },
            function(tag) {
                tag.type === 'class' &&
                    (this.jsdocNode = this.classes[tag.name] = jsdoc.createNode('class', tag.name));
            });
};
