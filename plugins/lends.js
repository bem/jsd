module.exports = function(jsdoc) {
    jsdoc
        .registerTag('lends', function(comment) {
            return { to : comment };
        })
        .registerBuilder(function(tag) {
            if(tag.type === 'lends') {
                var matches = tag.to.split('.');
                // TODO: refactor
                if(matches[matches.length - 1] === 'prototype') {
                    this.jsdocNode = this.classes[matches[0]].proto;
                }
                else {
                    this.jsdocNode = this.classes[matches[0]].static;
                }
            }
        });
};