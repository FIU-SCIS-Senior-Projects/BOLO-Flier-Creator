/* jshint node: true, mocha: true, expr:true */
'use strict';

/*
 * Unit Test: Client Access Port
 *
 */


/* Testing Utilities */
var expect = require('chai').expect;
var sinon = require('sinon');
var path = require('path');

var Promise = require('promise');

/* Base Project Paths */
var src_dir = path.join( __dirname, '../../src' );


/* Unit Under Test */
var ClientAccess = require( path.join( src_dir, 'core/ports/client-access-port.js' ) );


/* Fixtures */
var validBoloData = {
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
    archive         : false
};


/* Test Specification */
describe('client access port', function () {

    it('should create a new BOLO and save it', function () {
        /* arrange */
        var clientAccess = new ClientAccess();
        var mockStorageAdapter = {
            'insert' : function ( bolo ) { this.record = bolo; }
        };

        /* act */
        clientAccess.createBolo( validBoloData, mockStorageAdapter );

        /* assert */
        expect( mockStorageAdapter.record ).to.deep.equal( validBoloData );
    });

});
