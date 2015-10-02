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
var FileFactory = require( path.normalize( '../lib/file-fixture-factory.js' ) );

require('dotenv').config({
    path: path.resolve( __dirname, '../../.env' )
});



/* Base Project Paths */
var src_dir = path.resolve( __dirname, '../../src' );


/* Test Spec */
describe( 'file (system) media adapter', function () {
    var stat;
    var adapterFactory, fileMediaAdapter;

    before( function () {
        stat = Promise.denodeify( fs.stat );
        adapterFactory = require( path.join( src_dir, 'core/adapters' ) );
    });

    beforeEach( function () {
        fileMediaAdapter = adapterFactory.create( 'media', 'file' );
    });

    describe( 'when saving files', function () {
        var fileFactory;
        var uuidPromise, createdFileMetas = [];
        var srcImage;

        before( function () {
            srcImage = path.resolve( __dirname, '../assets', 'nodejs.png' );
            fileFactory = new FileFactory( srcImage );
        });

        after( function () {
            var uploadsPath = process.env.FILE_STORAGE_PATH;
            var noop = function () {};
            createdFileMetas.forEach( function ( fileMeta ) {
                var prefix = path.join( uploadsPath, fileMeta.uuid );
                fs.unlink( prefix + path.extname( fileMeta.filename ), noop );
                fs.unlink( prefix + '.json', noop );
            });
        });

        it( 'should save to a system configured location', function () {
            /* arrange */
            var uploadsPath = process.env.FILE_STORAGE_PATH;
            var extImage = path.extname( srcImage );
            var filePromise = fileFactory.create( 'file1' );

            /* act */
            uuidPromise = filePromise
                .then( function ( testFile ) {
                    return fileMediaAdapter.put( [ testFile ] );
                });

            /* assert */
            return uuidPromise
                .then( function ( value ) {
                    var fileMeta = value[0];
                    createdFileMetas.push( fileMeta );  // for later cleanup
                    return stat(
                        path.join( uploadsPath, fileMeta.uuid + extImage )
                    );
                })
                .then( function ( value ) {
                    expect( value.isFile() ).to.be.true;
                });
        });

        it( 'should return a uuid and the original filename in an object', function () {
            /* arrange */
            var expectedFilename = 'file1';
            var filePromise = fileFactory.create( expectedFilename );

            /* act */
            uuidPromise = filePromise
                .then( function ( testFile ) {
                    return fileMediaAdapter.put( [ testFile ] );
                });

            /* assert */
            return uuidPromise
                .then( function ( value ) {
                    var fileMeta = value[0];
                    createdFileMetas.push( fileMeta );  // for later cleanup
                    expect( fileMeta.uuid ).to.match(
                        // uuid format
                        /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i
                    );
                    expect( fileMeta.filename ).to.equal(
                        expectedFilename + path.extname( srcImage )
                    );
                });
        });

        it( 'should handle multiple files', function () {
            /* arrange */
            var filesPromise = fileFactory.create( [ 'file1', 'file2' ] );

            /* act */
            uuidPromise = filesPromise
                .then( function ( files ) {
                    return fileMediaAdapter.put( [ files[0], files[1] ] );
                });

            /* assert */
            return uuidPromise
                .then( function ( metas ) {
                    createdFileMetas = createdFileMetas.concat( metas );  // for later cleanup
                    expect( metas ).to.be.length( 2 );
                });
        });
    });

});

