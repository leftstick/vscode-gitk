;(function(window, document) {
  // Handle the message inside the webview
  window.addEventListener('message', event => {
    const message = event.data // The JSON data our extension sent

    if (message.command === 'see-detail') {
      document.querySelector('.detail').innerHTML = message.payload.content
      const selected = document.querySelector(`.selected`)
      if (selected) {
        selected.classList.remove('selected')
      }
      document.querySelector(`[data-hash="${message.payload.hash}"]`).classList.add('selected')
    }
  })
})(window, document)
