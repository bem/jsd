var astIterator = require('./ast-iterator');

function addBlockCommentsToAst(ast) {
    var commentNodes = ast.comments.filter(function(commentNode) {
            return commentNode.type === 'Block';
        }),
        i = 0,
        commentNode = commentNodes[i];

    if(!commentNode) {
        return;
    }

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
    var ast = require('esprima').parse(string, { comment : true, range : true });
    addBlockCommentsToAst(ast);
    ast.iterate = function(cb, acc) { astIterator(ast, cb, acc) };
    return ast;
};
