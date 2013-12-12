module.exports = function(jsdoc) {
    jsdoc
        .registerParser('constructor', Boolean)
        .registerBuilder('constructor', function(tag, curJsdocNode) {
            this.currentClass.cons = curJsdocNode;

            // we need to remove constructor from prototype if it is within
            var props = this.currentClass.proto.props,
                prop, i = 0;
            while(prop = props[i]) {
                if(prop.val === curJsdocNode) {
                    props.splice(i, 1);
                    break;
                }
                i++;
            }
        });
};
