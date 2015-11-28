/* jshint node: true */
'use strict';

var _       = require( 'lodash' );
var path    = require( 'path' );
var Agency  = require( path.resolve( __dirname, '../../src/core/domain/agency' ) );

var defaults = {
    'id'        : 'abc123',
    'name'      : 'Test Agency',
    'address'   : '123 Test Lane',
    'city'      : 'Test City',
    'state'     : 'FL',
    'zip'       : '33100',
    'phone'     : '(305) 345-6789'
};

module.exports.create = function ( opts ) {
    return new Agency( _.extend( defaults, opts ) );
};

module.exports.collection = function ( qty ) {
    var collection = [];
    for ( var i = 0; i < qty; i++ ) {
        collection.push( this.create() );
    }
    return collection;
};

module.exports.copy = function ( data ) {
    return new Agency( data );
};

