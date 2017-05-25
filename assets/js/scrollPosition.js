(function(document, localStorage) {
    //restore scroll position while detail changed
    if (document.querySelector('.commit.selected')) {
        document.querySelector('.commits').scrollTop = +localStorage.getItem('pos');
    }

    //record scroll position before detail gets changed
    document.querySelector('.commits').addEventListener('click', () => {
        localStorage.setItem('pos', document.querySelector('.commits').scrollTop);
    }, false);

}(document, localStorage));
