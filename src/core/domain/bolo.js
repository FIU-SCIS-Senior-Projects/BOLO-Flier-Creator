/*
 * BOLO Domain Model (Model)
 *
 */

/**
 * @constructor
 */
var Bolo = function ( data ) {
    this.data = data;
};

/**
 * Checks if the bolo is valid
 */
Bolo.prototype.isValid = function () {
    // TODO Validate data
    return true;
};

module.exports = Bolo;
