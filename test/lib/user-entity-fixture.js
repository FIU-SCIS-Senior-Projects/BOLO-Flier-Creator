/* jshint node: true */
'use strict';

var _ = require('lodash');
var path = require('path');

var User = require( path.resolve( __dirname, '../../src/core/domain/user' ) );

var defaults = {
    'username'      : 'superuser',
    'password'      : 'superuser1',
    'fname'         : 'Kevin',
    'lname'         : 'Flynn',
    'email'         : 'kflynn@en.com',
    'agency'        : 'Pinecrest',
    'tier'          : 1,
    'badge'         : '',
    'sectunit'      : '',
    'ranktitle'     : ''
};

module.exports.create = function ( opts ) {
    return new User( _.extend( defaults, opts ) );
};

module.exports.collection = function ( qty ) {
    var collection = [];
    for ( var i = 0; i < qty; i++ ) {
        collection.push( this.create() );
    }
    return collection;
};
