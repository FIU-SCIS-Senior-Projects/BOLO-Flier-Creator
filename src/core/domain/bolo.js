/*
 * BOLO Domain Model (Model)
 *
 */

/**
 * @constructor
 */
var Bolo = function (data) {
    this.data = data;
};

var Bolo = function () {
    this.data = {
        "_id": "",
        "_rev": "",
        "authorFName": "",
        "authorLName": "",
        "authorUName": "",
        "category": "",
        "firstName": "",
        "lastName": "",
        "dob": "",
        "dlNumber": "",
        "sex": "",
        "height": "",
        "weight": "",
        "tattoos": "",
        "videoLink": "",
        "additional": "",
        "summary": "",
        "enteredDT": "",
        "archive": "",
        "lastUnknownAddress":""
    };
};


/**
 * Checks if the bolo is valid
 */
Bolo.prototype.isValid = function () {
    // TODO Validate data
    return true;
};

module.exports = Bolo;