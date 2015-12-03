var bolo = window.bolo || {};

bolo.cache = {};
bolo.eventHandlers = {

};

bolo.cacheElements = function () {
    var ele = {};
    createBoloForm = document.querySelector('#create-bolo-form');
    bolo.cache.addImageGroup = document.querySelector('#form-add-img-group');
    bolo.cache.addImageButton = document.querySelector('#form-add-img-btn');
};

/*bolo.registerEvents = function () {
    bolo.cache.addImageButton.addEventListener('click', function (event) {
        var orig = bolo.cache.addImageGroup.querySelector('input[type="file"]');
        bolo.cache.addImageGroup.appendChild(orig.cloneNode());
    });
};*/

bolo.init = function () {
    bolo.cacheElements();
    //bolo.registerEvents();
};

window.addEventListener("load", function (event) {
    bolo.init();
});

$('.archive-bolo').click(function (bolo) {
    var id = $(this).data('bid');
    $.ajax({
        url: "/bolo/archive/" + id,
        method: "POST"
    }).done(function () {
        window.location.assign("/bolo");
    });
});

$('.delete-bolo').click(function (bolo) {
    var id = $(this).attr('id');
    $.ajax({
        url: "/bolo/delete/" + id,
        method:"POST"
    }).done(function () {
        window.location.assign( window.location.href );
    });
});

$('.restore-bolo').click(function (bolo) {
    var id = $(this).attr('id');
    $.ajax({
        url: "/bolo/restore/" + id,
        method:"POST"
    }).done(function () {
        window.location.assign( "/bolo/archive" );
    });
});