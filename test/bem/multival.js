/**
 * @module i-bem__dom
 */

modules.define('i-bem__dom', function(provide, BEMDOM) {

/**
 * @exports i-bem__dom:blocks.my-block
 * @class my-block
 * @bem my-block_my-mod_my-val1_my-val2
 */
BEMDOM.decl({ block : 'my-block', modName : 'my-mod', modVal : ['my-val1', 'my-val2'] }, {
});

provide(BEMDOM);

});
