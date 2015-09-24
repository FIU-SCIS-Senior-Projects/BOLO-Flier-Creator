/*
 * Mock Storage Adapter
 *
 * Implements required interface for a Bolo Domain Storage Port.
 */

var adapter = function () {
    this._records = new Array();
};

adapter.prototype.insert = function ( data ) {
    this._records.push( data );
}

module.exports = adapter;
