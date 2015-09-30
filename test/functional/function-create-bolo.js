/* jshint node: true, mocha: true, expr:true */
'use strict';

/*
 * Feature Test: Create BOLO
 *
 */

/* Dependencies */
var expect = require('chai').expect;
var path = require('path');

var src_dir = path.resolve( __dirname, '../../src/' );

var ClientAccessPort = require( path.join( src_dir, 'core/ports/client-access-port.js' ) );
var AdapterFactory = require( path.join( src_dir, 'core/adapters' ) );


/* Feature Test Specification */
describe( 'Officer creates a BOLO', function () {
    var clientAccess;
    var adapterFactory, storageAdapter;

    beforeEach( function () {
        clientAccess = new ClientAccessPort();
        storageAdapter = AdapterFactory.create( 'storage', 'mock' );
    });

    it( 'should save the BOLO to the system', function () {
        var date = new Date();
        var response;

        // given the BOLO has sufficient information
        var formData = {
            creationDate : date,
            authorFName : "Jason",
            authorLName : "Cohen",
            authorUName : "jcohen",
            category : "ROBBERY",
            firstName : 'Barry',
            lastName : 'Badman',
            dob : "01-23-1945",
            dlNumber : 'D123-456-78-900-0',
            race : "Asian",
            sex : "M",
            height : "6-01",
            weight : "185",
            hairColor : "Black",
            tattoos : "Tomato tattoo on right chest",
            address : "123 Gangsta Lane",
            additional : "",
            summary : "",
            agency : "Pinecrest",
            archive : false
        };

        // when the Officer submits the BOLO to be saved
        response = clientAccess.createBolo( formData, storageAdapter );

        // then the system will return a success message
        expect( response.success ).to.be.true;
    });

});