(function(document) {
    //display detail of first commit if no one selected before
    setTimeout(() => {
        if (!document.querySelector('.commit.selected')) {
            document.querySelector('.commit').click();
        }
    });

}(document));
