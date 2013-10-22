var iterableProps = ['body', 'expression', 'arguments', 'value', 'properties', 'declarations', 'init'];
module.exports = function iterateAst(node, cb, acc) {
    if((acc = cb(node, acc)) === false) {
        return false;
    }

    var i = 0, prop, nodeProp,
        j, arrNode;
    while(prop = iterableProps[i++]) {
        if(typeof (nodeProp = node[prop]) === 'object') {
            if(Array.isArray(nodeProp)) {
                j = 0;
                while(arrNode = nodeProp[j++]) {
                    if(iterateAst(arrNode, cb, acc) === false) {
                        return false;
                    }
                }
            }
            else {
                if(iterateAst(nodeProp, cb, acc) === false) {
                    return false;
                }
            }
        }
    }
};
