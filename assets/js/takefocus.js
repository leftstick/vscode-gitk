(function (document) {
    setTimeout(() => {
        document.querySelector('.commits').focus();
    });
    var element = document.getElementById('divCommits');
    var resizer = document.getElementById('resizer');
    resizer.addEventListener('mousedown', initResize, false);
    function initResize(e) {
        window.addEventListener('mousemove', Resize, false);
        window.addEventListener('mouseup', stopResize, false);
    }
    function Resize(e) {
        //    element.style.width = (e.clientX - element.offsetLeft) + 'px';
        element.style.height = (e.clientY - element.offsetTop) + 'px';
    }
    function stopResize(e) {
        window.removeEventListener('mousemove', Resize, false);
        window.removeEventListener('mouseup', stopResize, false);
    }
}(document));