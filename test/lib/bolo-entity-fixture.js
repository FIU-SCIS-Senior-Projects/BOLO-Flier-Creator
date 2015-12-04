/* jshint node: true */
'use strict';

var path = require('path');

var Bolo = require( path.resolve( __dirname, '../../src/core/domain/bolo' ) );

module.exports.create = function () {
    return new Bolo({
        id              : '324f2342aa34',
        creationDate    : ( new Date() ).toString(),
        lastUpdate      : '',
        agency          : 'Pinecrest',
        authorFName     : 'Jason',
        authorLName     : 'Cohen',
        authorUName     : 'jcohen',
        category        : 'ROBBERY',
        firstName       : 'Barry',
        lastName        : 'Badman',
        dob             : '01-23-1945',
        dlNumber        : 'D123-456-78-900-0',
        race            : 'Asian',
        sex             : 'M',
        height          : '6-01',
        weight          : '185',
        hairColor       : 'Black',
        tattoos         : 'Tomato tattoo on right chest',
        address         : '123 Gangsta Lane',
        additional      : '',
        summary         : '',
        archive         : false,
        isActive        : true
    });
};

module.exports.collection = function ( qty ) {
    var collection = [];
    for ( var i = 0; i < qty; i++ ) {
        collection.push( this.create() );
    }
    return collection;
};

module.exports.copy = function ( data ) {
    return new Bolo( data );
};
