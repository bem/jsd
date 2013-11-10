var esprima = require('esprima'),
    astIterator = require('./ast-iterator');

function addJsDocCommentsToAst(ast) {
    var commentNodes = ast.comments.filter(function(commentNode) {
            return commentNode.type === 'Block' && commentNode.value[0] === '*';
        }),
        i = 0,
        commentNode = commentNodes[i];

    if(!commentNode) {
        return;
    }

    delete ast.comments;

    astIterator(ast, function(node) {
        if(node.range) {
            if(node.range[0] >= commentNode.range[1]) {
                node.comments = commentNode;
                if(!(commentNode = commentNodes[++i])) {
                    return false;
                }
            }
        }
    });
}

module.exports = function(string) {
    var ast = esprima.parse(string, { comment : true, range : true, loc : true });
    addJsDocCommentsToAst(ast);
    ast.iterate = function(cb, acc) {
        astIterator(
            ast,
            function(astNode, acc) {
                return astNode.comments?
                    cb(astNode, acc) :
                    acc;
            },
            acc);
    };
    return ast;
};
