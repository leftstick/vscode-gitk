;(function(document, global) {
  document.querySelector('.commits').addEventListener('click', e => {
    const commitNode = window.getCommitNode(e.target)
    if (!commitNode) {
      return
    }
    const hash = commitNode.querySelector('.hash').innerHTML

    global.vscode.postMessage({
      command: 'read-detail',
      payload: {
        hash
      }
    })
  })
})(document, window)
