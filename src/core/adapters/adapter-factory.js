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
    var theAdapter;
    var adapter_file = adapter + "-" + port + "-adapter.js";
    var adapter_path = path.join( port, adapter_file );

    try {
        theAdapter = require( "./" + adapter_path );
    }
    catch ( e ) {
        throw new Error(
            "Adapter does not exist: " + path.resolve( adapter_path )
        );
    }

    return new theAdapter();
};

/**
 * List available adapters.
 *
 * @return {Array.String} Array containing the names of adapters in implemented
 */
factory.list = function ( port ) {
    var list = [];

    try {
        list = fs.readdirSync( path.join( './', port ) );
    }
    catch ( e ) {
        throw new Error(
            "Port does not exist: " + port
        );
    }

    return list;
};

module.exports = factory;
