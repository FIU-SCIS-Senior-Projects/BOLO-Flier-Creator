/* jshint node:true */
'use strict';

module.exports.setDataAccessors = function ( entity_data, context ) {
    Object.keys( entity_data ).forEach( function ( key ) {
        Object.defineProperty( context, key, {
            'get': function ( ) { return entity_data[key]; },
            'set': function ( v ) { entity_data[key] = v; }
        });
    });
};

/**
 * @todo Extract common entity operations (e.g. .same and .diff) into this
 * module and use it to extend the concrete entity objects' prototypes.
 */
