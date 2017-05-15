(function(global) {

    global.getCommitNode = function(node) {
        if (node.tagName === 'BODY') {
            return;
        }
        if (node.classList.contains('commit')) {
            return node;
        }
        return global.getCommitNode(node.parentNode);
    };

}(window));