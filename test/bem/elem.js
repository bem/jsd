/**
 * @module i-bem__dom
 */

modules.define('i-bem__dom', function(provide, BEMDOM) {

/**
 * @exports i-bem__dom:blocks.my-block__my-elem1
 * @class my-block__my-elem1
 * @bem my-block__my-elem1
 */
BEMDOM.decl({ block : 'my-block', elem : 'my-elem1' }, {
});

/**
 * @exports i-bem__dom:blocks.my-block__my-elem2
 * @class my-block__my-elem2
 * @bem my-block__my-elem2_my-mod_my-val
 */
BEMDOM.decl({ block : 'my-block', elem : 'my-elem2', modName : 'my-mod', modVal : 'my-val' }, {
});

provide(BEMDOM);

});
