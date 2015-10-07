/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');


/**
 * @description Factory for creating new adapter objects
 * @module core/adapters
 */


/**
 * Request the creation of a new port adapter.
 *
 * @arg {String} - Name of the port the adapter implements.
 * @arg {String} - Name of the adapter
 * @returns - A new instance of the requested adapter.
 */
exports.create = function ( port, adapter ) {
    var AdapterObject;
    var adapterFile = [adapter, port, 'adapter.js'].join('-');
    var adapterPath = path.join( __dirname, port, adapterFile );

    try {
        AdapterObject = require( adapterPath );
    }
    catch ( e ) {
        throw new Error(
            "Adapter does not exist: " +  adapterPath
        );
    }

    return new AdapterObject();
};


/**
 * List available adapters.
 *
 * @param - The port type to list adapters for.
 * @return {String|Array} Array containing the names of adapters in implemented
 */
exports.list = function ( port ) {
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
