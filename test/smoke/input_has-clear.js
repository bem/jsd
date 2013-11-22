/**
 * @module i-bem__dom
 */

modules.define('i-bem__dom', function(provide, BEMDOM) {

/**
 * @exports i-bem__dom:blocks.input
 * @class input
 * @bem input_has-clear
 */

BEMDOM.decl({ block : 'input', modName : 'has-clear', modVal : true }, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.__base.apply(this, arguments);

                this
                    .on('change', this._updateClear)
                    ._updateClear();
            }
        }
    },

    _onClearClick : function() {
        this
            .setVal('', { source : 'clear' })
            .setMod('focused');
    },

    _updateClear : function() {
        this.toggleMod(this.elem('clear'), 'visible', true, !!this._val);
    }
}, {
    live : function() {
        this.liveBindTo('clear', 'pointerclick', function() {
            this._onClearClick();
        });

        return this.__base.apply(this, arguments);
    }
});

provide(BEMDOM);

});
