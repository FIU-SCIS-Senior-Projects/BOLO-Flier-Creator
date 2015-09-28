/*
 * Factory for creating new adapter objects
 */


/* Dependencies */
var fs = require('fs');
var path = require('path');


/* Helpers */


/* Main Factory Object */
var factory = {};

/**
 * Get an instance of the requested adapter
 *
 * @arg {string} port
 * @arg {string} adapterName - The name of the requested adapter.
 */
factory.create = function ( port, adapter ) {
    var adapterObject;
    var adapterFile = [adapter, port, 'adapter.js'].join('-');
    var adapterPath = path.join( __dirname, port, adapterFile );

    try {
        adapterObject = require( adapterPath );
    }
    catch ( e ) {
        throw new Error(
            "Adapter does not exist: " +  adapterPath
        );
    }

    return new adapterObject();
};

/**
 * List available adapters.
 *
 * @return {Array.String} Array containing the names of adapters in implemented
 */
factory.list = function ( port ) {
    var list = [];

    try {
        list = fs.readdirSync( path.join( __dirname, port ) );
    }
    catch ( e ) {
        throw new Error(
            "Port does not exist: " + port
        );
    }

    return list;
};

module.exports = factory;
