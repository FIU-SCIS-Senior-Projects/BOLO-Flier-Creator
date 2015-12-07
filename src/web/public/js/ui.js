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


bolo.init = function () {
    bolo.cacheElements();
};

window.addEventListener("load", function (event) {
    bolo.init();
});