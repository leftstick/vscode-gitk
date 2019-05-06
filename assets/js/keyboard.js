(function(document, global) {

    const commitsEle = document.querySelector('.commits');
    const lineHeight = height(document.querySelector('.commit'));

    document.querySelector('.commits').addEventListener('keydown', (e) => {
        if (e.keyCode !== 40 && e.keyCode !== 38) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();

        const selectedEle = document.querySelector('.commit.selected');

        const nextEle = e.keyCode === 40 ? selectedEle.nextElementSibling : selectedEle.previousElementSibling;

        if (!nextEle) {
            return;
        }
        if (e.keyCode === 40 && nextEle.offsetTop + lineHeight > commitsEle.offsetHeight) {
            commitsEle.scrollTop += lineHeight;
        }
        if (e.keyCode === 38 && nextEle.offsetTop < commitsEle.scrollTop) {
            commitsEle.scrollTop -= lineHeight;
        }

        nextEle.click();
    }, false);
    
    document.querySelector('.commits').addEventListener('keydown', (e) => {
        if (e.keyCode !== 33 && e.keyCode !== 34) { // pageUp pageDown
            return;
        }
        if (!e.metaKey) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const detail = document.querySelector('.detail');
        if (detail) {
            const viewHeight = detail.clientHeight;
            detail.scrollBy(0, (e.keyCode === 33 ? -1 : 1) * viewHeight);
        }
    }, false);

    function height(el) {

        const styles = global.getComputedStyle(el);
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

        return Math.ceil(el.offsetHeight + margin);
    }

}(document, window));
