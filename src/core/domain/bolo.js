/*
 * BOLO Domain Model (Model)
 *
 */

/**
 * @constructor
 */
var Bolo = function ( data ) {
    this._data = data;
};


/**
 * Save a BOLO to the provided storage interface.
 *
 * @param storageInterface - A storage adapter which implements the storage
 * port interface.
 */
Bolo.prototype.save = function ( storageInterface ) {
    storageInterface.insert( this._data );
};

module.exports = Bolo;
