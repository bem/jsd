module.exports = function(jsdoc) {
    var INHERIT = jsdoc.require('inherit');

    jsdoc
        .registerTag('returns', function(comment) {
            var match = comment.match(/^(?:{([^}]+)}\s*)?(.*?)\s*$/);
            return {
                jsType : match[1],
                description : match[2]
            };
        })
        .registerNode('returns', INHERIT({
            __constructor : function(description, jsType) {
                this.description = description;
                this.jsType = jsType;
            }
        }, {
            type : 'returns'
        }))
        .registerBuilder(
            function() {
                this.isFunction = false;
            },
            function(tag) {
                tag.type === 'returns' &&
                    (this.jsdocNode.returns = jsdoc.createNode('returns', tag.description, tag.jsType));
            });
};
