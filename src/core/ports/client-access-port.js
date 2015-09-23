/*
 * Client Access Port
 *
 * This port provides an API for client adapters to interact with user facing
 * functionality.
 *
 */

/* Dependencies */
var Bolo = require('../domain/bolo.js');

/*
 * @constructor
 */
var ClientPort = function () {};

/**
 * Create a new BOLO in the system.
 *
 * @param {object} boloData - Data for the new BOLO
 * @param storateAdapter - A storage adapter implementing the Storage Port
 *          Interface.
 */
ClientPort.prototype.createBolo = function ( boloData, storageAdapter ) {
    var bolo = new Bolo( boloData );
    bolo.save( storageAdapter );
    return { success: true };
};

module.exports = ClientPort;
