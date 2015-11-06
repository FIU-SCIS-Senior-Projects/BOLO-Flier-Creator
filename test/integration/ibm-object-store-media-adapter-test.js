/* jshint node: true, mocha: true, expr: true  */
'use strict';

var expect = require('chai').expect;
var fs = require('fs');
var os = require('os');
var path = require('path');
var Promise = require('promise');
var sinon = require('sinon');

var src = path.resolve( __dirname, '../../src' );
var ObjectStorage = require( path.join( src, 'core/lib/ibm-object-storage' ) );
var Bulk = require( path.join( src, 'core/lib/ibm-object-storage/bulk' ) );
var AdapterFactory = require( path.join( src, 'core/adapters' ) );

require('dotenv').config({ path: path.resolve( __dirname, '../../.env' ) });


/* == Helpers =============================================================== */
var nameFilter = function ( obj ) { return obj.name; };


/* == Test Spec ============================================================= */
describe.skip( 'ibm object store media adapter', function () {
    var stat, oAccount, oContainer;
    var adapterFactory, ostoreAdapter;
    var osAccount, osContainer;

    before( function () {
         this.timeout( 100000 );
        return ObjectStorage.connect( 'bolo-app' )
            .then( function ( account ) {
                osAccount = account;
                return osAccount.useContainer( 'uploads' );
            })
            .then( function ( container ) {
                osContainer = container;
                return Promise.resolve( null );
            })
            .catch( function ( error ) {
                throw error;
            });
    });

    beforeEach( function () {
        ostoreAdapter = AdapterFactory.create( 'media', 'ibm-object-storage' );
        return ostoreAdapter;
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
        });

        it( 'returns an empty array if passed an empty array', function () {
            uuidPromise = ostoreAdapter.put( [] );

            return uuidPromise
                .then( function ( val ) {
                    expect( val ).to.be.an( 'array' ).and.be.empty;
                });
        });

        it( 'stores to a system configured container', function () {
            /* arrange */
            var uploadContainer = process.env.OSTORE_BOLO_CONT;
            var meta;
            this.timeout( 100000 );

            /* act */
            uuidPromise = ostoreAdapter.put( [ srcImage ] );

            /* assert */
            return uuidPromise
                .then( function ( metas ) {
                    meta = metas[0];
                    return osContainer.list();
                })
                .then( function ( list ) {
                    expect( list.map( nameFilter ) ).to.contain( meta.uuid );
                    return Promise.resolve( list );
                });
        });

        it( 'returns a uuid and the original filename in an object', function () {
            /* arrange */
            var expectedFilename = path.basename( srcImage );

            /* act */
            uuidPromise = ostoreAdapter.put( [ srcImage ] );

            /* assert */
            return uuidPromise
                .then( function ( metas ) {
                    var fileMeta = metas[0];
                    expect( fileMeta.uuid ).to.match(
                        // uuid format
                        /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i
                    );
                    expect( fileMeta.filename ).to.equal( expectedFilename  );
                });
        });

        it( 'should handle multiple files', function () {
            /* act */
            uuidPromise = ostoreAdapter.put( [ srcImage, srcImage ] );

            /* assert */
            return uuidPromise
                .then( function ( metas ) {
                    expect( metas ).to.be.length( 2 );
                });
        });
    });

});

