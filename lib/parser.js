var iterableProps = ['body', 'expression', 'arguments', 'value', 'properties'];
function iterateAst(node, cb) {
    if(cb(node) === false) {
        return false;
    }

    var i = 0, prop, nodeProp,
        j, arrNode;
    while(prop = iterableProps[i++]) {
        nodeProp = node[prop];
        if(nodeProp) {
            if(Array.isArray(nodeProp)) {
                j = 0;
                while(arrNode = nodeProp[j++]) {
                    if(iterateAst(arrNode, cb) === false) {
                        return false;
                    }
                }
            }
            else {
                if(iterateAst(nodeProp, cb) === false) {
                    return false;
                }
            }
        }
    }
}

function addBlockCommentsToAst(ast) {
    var commentNodes = ast.comments.filter(function(commentNode) {
            return commentNode.type === 'Block';
        }),
        i = 0,
        commentNode = commentNodes[i];

    if(!commentNode) {
        return;
    }

    iterateAst(ast, function(node) {
        if(node.range) {
            if(node.range[0] > commentNode.range[1]) {
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
    ast.iterate = function(cb) { iterateAst(ast, cb) };
    return ast;
};