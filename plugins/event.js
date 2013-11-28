module.exports = function(jsdoc) {
    jsdoc
        .registerParser('event', function(comment) {
            var matches = comment.match(/^(\w+)(?:\s+(.*?))?\s*$/);
            return { name : matches[1], description: matches[2] };
        })
        .registerBuilder('event', function(tag) {
            var eventNode = {
                    jsdocType : 'event',
                    name : tag.name,
                    description : tag.description
                },
                curClass = this.currentClass;
            (curClass.events || (curClass.events = [])).push(eventNode);
            return eventNode;
        });
};
