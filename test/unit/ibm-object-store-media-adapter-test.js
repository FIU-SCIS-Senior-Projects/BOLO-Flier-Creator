/* jshint node: true, mocha: true, expr: true  */
'use strict';


/*
 * IBM Object Store Media Adapter -- Unit Test
 *
 */


/* Testing Utilities */
var expect = require('chai').expect;
var sinon = require('sinon');


/* Other Dependencies */
var fs = require('fs');
var os = require('os');
var path = require('path');
var Promise = require('promise');

/* load up IBM Object Storage Service Connectin Secrets */
require('dotenv').config({ path: path.resolve( __dirname, '../../.env' ) });
var ostore = require( path.join( __dirname, '../../src/core/lib/object-storage-connection.js' ) );

/* Base Project Paths */
var src_dir = path.resolve( __dirname, '../../src' );


/* Helpers */
var nameFilter = function ( obj ) { return obj.name; };


/* Test Spec */
describe( 'ibm object store media adapter', function () {
    var stat;
    var adapterFactory, ibmObjStoreAdapter;

    before( function () {
        adapterFactory = require( path.join( src_dir, 'core/adapters' ) );
    });

    beforeEach( function () {
        ibmObjStoreAdapter = adapterFactory.create( 'media', 'ibm-object-storage' );
    });

    describe( 'when saving files', function () {
        var fileFactory;
        var uuidPromise;
        var srcImage;
        var createdMetas = [];  // for cleanup

        before( function () {
            srcImage = path.resolve( __dirname, '../assets', 'nodejs.png' );
        });

        after( function () {
            this.timeout( 10000 );
            return ostore
                .init()
                .then( function () {
                    return ostore._cbd( true );
                });
        });

        it( 'returns an empty array if passed an empty array', function () {
            uuidPromise = ibmObjStoreAdapter.put( [] );

            return uuidPromise
                .then( function ( val ) {
                    expect( val ).to.be.an( 'array' ).and.be.empty;
                });
        });

        it( 'stores to a system configured container', function () {
            /* arrange */
            var uploadContainer = process.env.OSTORE_BOLO_CONT;
            var meta;
            this.timeout( 10000 );

            /* act */
            uuidPromise = ibmObjStoreAdapter.put( [ srcImage ] );

            /* assert */
            return uuidPromise
                .then( function ( metas ) {
                    meta = metas[0];
                    return ostore.containerList();
                })
                .then( function ( list ) {
                    expect( list.map( nameFilter ) ).to.contain( meta.uuid );
                    return Promise.resolve( list );
                });
        });

        it.skip( 'returns a uuid and the original filename in an object', function () {
            /* arrange */
            var expectedFilename = 'file1';
            var filePromise = fileFactory.create( expectedFilename );

            /* act */
            uuidPromise = ibmObjStoreAdapter.put( [ srcImage ] );

            /* assert */
            return uuidPromise
                .then( function ( value ) {
                    var fileMeta = value[0];
                    expect( fileMeta.uuid ).to.match(
                        // uuid format
                        /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i
                    );
                    expect( fileMeta.filename ).to.equal(
                        expectedFilename + path.extname( srcImage )
                    );
                });
        });

        it.skip( 'should handle multiple files', function () {
            /* act */
            uuidPromise = ibmObjStoreAdapter.put( [ srcImage, srcImage ] );

            /* assert */
            return uuidPromise
                .then( function ( metas ) {
                    expect( metas ).to.be.length( 2 );
                });
        });
    });

});

