/**
 * @module i-bem__dom
 */

modules.define('i-bem__dom', function(provide, BEMDOM) {

/**
 * @exports i-bem__dom:blocks.my-block
 * @class my-block
 * @bem
 */
BEMDOM.decl('my-block', {
});

/**
 * @exports i-bem__dom:blocks.my-block__my-elem1
 * @class my-block__my-elem1
 * @bem
 */
BEMDOM.decl({ block : 'my-block', elem : 'my-elem1' }, {
});

/**
 * @exports i-bem__dom:blocks.my-block__my-elem2
 * @class my-block__my-elem2
 * @bem
 */
BEMDOM.decl({ block : 'my-block', elem : 'my-elem2', modName : 'my-mod', modVal : 'my-val' }, {
});

/**
 * @exports i-bem__dom:blocks.my-block__my-elem3
 * @class my-block__my-elem3
 * @bem
 */
BEMDOM.decl({ block : 'my-block', elem : 'my-elem3', modName : 'my-mod', modVal : ['my-val1', 'my-val2'] }, {
});

provide(BEMDOM);

});
