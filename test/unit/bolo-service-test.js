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
var BoloService = require( path.join( src_dir, 'core/service/bolo-service' ) );


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

var fileAttachments = {
    image   : [ '/path/to/image.jpg' ],
    video   : [ '/path/to/video1.avi', '/path/to/video2.avi' ],
    audio   : [ '/path/to/audio.mp3' ]
};


/* Helper Methods */
var makeMeta = function ( file ) {
    return {
        uuid : "some-generated-uuid",
        filename : path.basename( file )
    };
};


/* Test Specification */
describe('client access port module', function () {
    var mockStorageAdapter, mockMediaAdapter;
    var clientAccess;

    before( function () {
        /* setup mocks */
        mockStorageAdapter = {
            insert : function ( bolo ) {
                // expected to resolve a promise when done inserting
                return Promise.resolve( this.record = bolo  );
            }
        };
        mockMediaAdapter = {
            put : function ( files ) {
                // expected to return meta data for saved files in a promise
                return Promise.resolve( files.map( makeMeta ) );
            }
        };
    });

    beforeEach( function () {
        clientAccess = new BoloService( mockStorageAdapter, mockMediaAdapter );
    });

    afterEach( function () {
        mockStorageAdapter.record = null;
    });

    it( 'implements the client access port interface', function () {
        var interface_methods = [
            'createBolo'
        ];

        interface_methods.map( function ( method ) {
            expect( clientAccess ).to.respondTo( method );
        });
    });

    describe( 'createBolo method', function () {
        it( 'saves valid BOLO data into a Storage Port', function () {
            /* act */
            var promise = clientAccess.createBolo( validBoloData );

            /* assert */
            var msa = mockStorageAdapter;
            return promise
                .then( function ( result ) {
                    var msg = "Input is most likely _invalid_";
                    expect( result ).to.contain.property( 'success', true, msg );
                    expect( msa.record ).to.include( validBoloData );
                });
        });

        it( 'inserts file attachments into the BOLO', function () {
            /* arrange */
            var fa = fileAttachments;
            var msa = mockStorageAdapter;

            /* act */
            var promise = clientAccess
                .createBolo( validBoloData, fileAttachments );

            /* assert */
            return promise
                .then( function ( result ) {
                    expect( msa.record ).to.contain.key( 'image' );
                    expect( msa.record.image[0] ).to.contain.deep.property(
                        'filename', path.basename( fa.image[0] )
                    );
                });
        });
    });

});
