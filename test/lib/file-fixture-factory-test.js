/* jshint node: true */

var expect = require('chai').expect;

var fs = require('fs');
var path = require('path');
var FileFactory = require('./file-fixture-factory.js');
var Promise = require('promise');

/*
 * Helpers
 */
var unlink = Promise.denodeify( fs.unlink );

/*
 * Test Spec
 */
describe( 'the file fixture factory', function () {
    var factory;
    var sourcePath, sourceFile, sourceExt;

    before( function () {
        sourceFile = path.resolve( __dirname, '../assets/nodejs.png' );
        sourceParts = path.parse( sourceFile );
    });

    beforeEach( function () {
        factory = new FileFactory( sourceFile );
    });

    it( 'should instantiate with with a source template file', function () {
        expect( factory.src ).to.equal( sourceFile );
    });

    it( 'should create a single file in the source file directory', function () {
        var filePromise = factory.create( 'file' );
        var expectedPath = path.join( sourceParts.dir, 'file' + sourceParts.ext );

        return filePromise
            .then( function ( createdFile ) {
                expect( createdFile ).to.be.a( 'string' );
                expect( createdFile ).to.equal( expectedPath );
                // if created file cannot be deleted then its not there
                return unlink( expectedPath );
            })
            .catch( function ( error ) {
                throw new Error( 'Could not delete expected factory output file');
            });
    });

    it( 'should create multiple files in the source file directory', function () {
        var filesPromise = factory.create( [ 'file_01', 'file_02' ] );
        var expectedPaths = [
            path.join( sourceParts.dir, 'file_01' + sourceParts.ext ),
            path.join( sourceParts.dir, 'file_02' + sourceParts.ext )
        ];

        return filesPromise
            .then( function ( createdFiles ) {
                expect( createdFiles ).to.be.an( 'array' );
                // rejects if a file can't be deleted
                return Promise.all( expectedPaths.map( function ( val ) {
                    return unlink( val );
                } ) );
            })
            .catch( function ( error ) {
                throw new Error( 'could not delete expected factory ouput files' );
            });
    });
});