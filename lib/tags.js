var Tags = module.exports = function(tags) {
    this._tags = tags;
};

Tags.prototype = {
    forEach : function(cb) {
        this._tags.forEach(cb);
    },

    hasTagByType : function(type) {
        var i = 0, tag;
        while(tag = this._tags[i++]) {
            if(tag.type === 'type') {
                return true;
            }
        }
        return false;
    }
};