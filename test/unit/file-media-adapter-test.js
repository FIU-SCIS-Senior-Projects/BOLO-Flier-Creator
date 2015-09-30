/* jshint node: true, mocha: true, expr: true  */
'use strict';


/*
 * File Media Adapter -- Unit Test
 *
 */


/* Testing Utilities */
var expect = require('chai').expect;
var sinon = require('sinon');
var path = require('path');


/* Other Dependencies */
var fs = require('fs');
var buf = require('buffer');
var Promise = require('promise');

require('dotenv').config({
    path: path.resolve( __dirname, '../../.env' )
});


/* Base Project Paths */
var src_dir = path.resolve( __dirname, '../../src' );


/* Test Helpers */
var copy = function ( src, dst ) {
    var srcFile = fs.createReadStream( src );
    var dstFile = fs.createWriteStream( dst );
    return new Promise ( function ( fulfill, reject ) {
        srcFile.pipe( dstFile );
        dstFile.on( 'finish', fulfill );
        dstFile.on( 'error', reject );
        srcFile.on( 'error', reject );
    });
};


/* Test Spec */
describe( 'file (system) media adapter', function () {
    var stat;
    var adapterFactory, fileMediaAdapter;
    var imagePath, srcImage, testImage, extImage;

    before( function () {
        stat = Promise.denodeify( fs.stat );
        adapterFactory = require( path.join( src_dir, 'core/adapters' ) );

        srcImage = path.resolve( __dirname, '../assets', 'nodejs.png' );
        testImage = path.resolve( __dirname, '../assets', 'test.png' );
        extImage = path.extname( srcImage );

    });

    beforeEach( function () {
        fileMediaAdapter = adapterFactory.create( 'media', 'file' );
    });

    describe( 'when saving files', function () {
        var uploadsPath;
        var uuidPromise, collectedPromises = [];

        beforeEach( function () {
            return copy( srcImage, testImage )
                .catch( function ( error ) {
                    throw new Error( "failed to create test image" );
                });
        });

        /*
         * TODO
         * Cleanup files created in the configured uploads directory
         *
         * Probably need to cleanup at the end of each promise. It may be
         * difficult to deal with race conditions with a collectino strategy
         * or trying to use the "after" hook method.
         */

        it( 'should return a uuid and the original filename in an object', function () {
            /* act */
            uuidPromise = fileMediaAdapter.put( [ testImage ] );

            /* assert */
            return uuidPromise
                .then( function ( value ) {
                    var fileMeta = value[0];
                    expect( fileMeta.uuid ).to.match(
                        // uuid format
                        /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i
                    );
                    expect( fileMeta.filename ).to.equal(
                        path.basename( testImage )
                    );
                });
        });

        it( 'should save to a system configured location', function () {
            /* arrange */
            uploadsPath = process.env.FILE_STORAGE_PATH;

            /* act */
            uuidPromise = fileMediaAdapter.put( [ testImage ] );

            /* assert */
            return uuidPromise
                .then( function ( value ) {
                    var fileMeta = value[0];
                    return stat(
                        path.join( uploadsPath, fileMeta.uuid + extImage )
                    );
                })
                .then( function ( value ) {
                    expect( value.isFile() ).to.be.true;
                });
        });
    });

});

