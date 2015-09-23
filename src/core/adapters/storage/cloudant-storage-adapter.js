/*
 * Cloudant Storage Adapter
 *
 * Implements required interface for a Bolo Domain Storage Port for the
 * Cloudant Database.
 */

var adapter = function () {};

adapter.prototype.insert = function ( data ) {
    this._records.push( data );
};

module.exports = adapter;
