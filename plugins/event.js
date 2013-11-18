module.exports = function(jsdoc) {
    jsdoc
        .registerParser('event', function(comment) {
            return { name : comment };
        })
        .registerBuilder('event', function(tag) {
            var eventNode = { type : 'event', name : tag.name },
                curClass = this.currentClass;
            (curClass.events || (curClass.events = [])).push(eventNode);
            return eventNode;
        });
};
