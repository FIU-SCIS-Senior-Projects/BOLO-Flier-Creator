/* jshint node: true, mocha: true, expr:true */
'use strict';

/*
 * Feature Test: Create BOLO
 *
 */

/* Testing Utilities */
var expect = require('chai').expect;


/* Dependencies */
var fs = require('fs');
var os = require('os');
var path = require('path');
var Promise = require('promise');
var FileFactory = require( '../lib/file-fixture-factory.js' );


/* Base Project Path */
var src_dir = path.resolve( __dirname, '../../src/' );

var ClientAccess = require( path.join( src_dir, 'core/ports/client-access-port.js' ) );
var AdapterFactory = require( path.join( src_dir, 'core/adapters' ) );


/* Test Fixtures */
var formData = {
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


/* Feature Test Specification */
describe( 'When the Officer creates a BOLO', function () {
    var clientAccess;
    var adapterFactory, storageAdapter, mediaAdapter;
    var imageFactory, imageAtachment;

    before( function () {
        storageAdapter = AdapterFactory.create( 'storage', 'mock' );
        mediaAdapter = AdapterFactory.create( 'media', 'file' );
        process.env.FILE_STORAGE_PATH = os.tmpdir();
        imageFactory = new FileFactory( path.join( __dirname, '../assets/nodejs.png' ) );
    });

    beforeEach( function () {
        clientAccess = new ClientAccess( storageAdapter, mediaAdapter );
    });

    it( 'the BOLO is saved to the system', function () {
        var imagePromise = imageFactory.create( 'file1' );
        var savePromise;

        // when the Officer submits the BOLO to be saved
        savePromise = imagePromise
            .then( function ( image ) {
                var attach = { image: [ image ] };
                return clientAccess.createBolo( formData, attach );
            });

        // then the system will return a success message
        return savePromise
            .then( function ( response ) {
                expect( response.success ).to.be.true;
            });
    });

});