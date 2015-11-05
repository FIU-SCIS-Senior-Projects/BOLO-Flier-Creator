/* jshint node: true, mocha: true, expr: true */

var expect = require('chai').expect;

var fs = require('fs');
var path = require('path');
var FileFactory = require('./file-fixture-factory.js');
var Promise = require('promise');

/*
 * Test Spec
 */
describe( 'the file fixture factory module', function () {
    var factory;
    var sourcePath, sourceFile, sourceExt;

    before( function () {
        sourceFile = path.resolve( __dirname, '../assets/nodejs.png' );
        sourceParts = path.parse( sourceFile );
    });

    beforeEach( function () {
        factory = new FileFactory( sourceFile );
    });

    afterEach( function () {
        return factory.shutitdown();
    });

    it( 'should instantiate with with a source template file', function () {
        expect( factory.src ).to.equal( sourceFile );
    });

    it( 'should throw an error when instantiated with a relative path', function () {
        var relativePath = '../assets/nodejs.png';
        var didThrow = false;

        try {
            factory = new FileFactory( relativePath );
        }
        catch ( err ) {
            didThrow = true;
        }

        expect(didThrow).to.be.true;
    });

    it( 'should create a single file in the source file directory', function () {
        var filePromise = factory.create( 'file' );
        var expectedPath = path.join( sourceParts.dir, 'file' + sourceParts.ext );

        return filePromise
            .then( function ( createdFile ) {
                expect( createdFile ).to.be.a( 'string' );
                expect( createdFile ).to.equal( expectedPath );
                return null;
            });
    });

    it( 'should create multiple files in the source file directory', function () {
        var filesPromise = factory.createBulk( [ 'file_01', 'file_02' ] );
        var expectedPaths = [
            path.join( sourceParts.dir, 'file_01' + sourceParts.ext ),
            path.join( sourceParts.dir, 'file_02' + sourceParts.ext )
        ];

        return filesPromise
            .then( function ( createdFiles ) {
                expect( createdFiles ).to.be.an( 'array' );
                expect( createdFiles ).to.contain( expectedPaths[0] );
                expect( createdFiles ).to.contain( expectedPaths[1] );
            });
    });
});