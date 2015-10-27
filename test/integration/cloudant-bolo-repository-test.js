/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;

var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var BoloFixture = require('../lib/bolo-entity-fixture');
var AdapterFactory = require( path.join( src, 'core/adapters') );
var FileFixtureFactory = require('../lib/file-fixture-factory.js');

require('dotenv').config({ path: path.resolve( __dirname, '../../.env' ) });

describe( 'BOLO Repository Storage Adapter', function () {
    var boloRepository;
    var bolo, insertedBoloID;

    this.timeout( 5000 );

    before( function () {
        boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    });

    beforeEach( function () {
        bolo = BoloFixture.create();
    });

    describe( '#insert method repository method', function () {
        it( 'promises to return the bolo', function () {
            /* act */
            var boloPromise = boloRepository.insert( bolo );

            /* assert */
            return boloPromise
                .then( function ( newbolo ) {
                    expect( bolo.diff( newbolo ) ).to.be.length( 1 )
                        .and.to.contain( 'id' );
                    insertedBoloID = newbolo.data.id;
                });
        });

        it( 'promises to return a new bolo with attachments', function () {
            /* arrange */
            var imageFactory = new FileFixtureFactory(
                path.resolve( __dirname, '../assets/nodejs.png' )
            );

            var attachmentDTO = imageFactory.create( 'suspect' )
                .then( function ( imageFixturePath ) {
                    return [{
                        'name': 'suspect.png',
                        'content_type': 'image/png',
                        'path': imageFixturePath
                    }];
                });

            /* act */
            var boloPromise = attachmentDTO
                .then( function ( attachments ) {
                    return boloRepository.insert( bolo, attachments );
                });

            /* assert */
            return boloPromise
                .then( function ( newbolo ) {
                    expect( newbolo.data.attachments['suspect.png'] ).to.exist;
                });
        });
    }); /* end describe: #insert method */

    describe( '#delete method', function () {
        it( 'promises an error if the bolo id is not found', function () {
            /* act */
            var responsePromise = boloRepository.delete( 'non-existant-id' );

            /* assert */
            return responsePromise
                .then( function ( response ) {
                    // test failure
                })
                .catch( function ( response ) {
                    expect( response ).to.be.instanceOf( Error );
                });
        });

        it( 'promises the id and ok status', function () {
            /* act */
            var responsePromise = boloRepository.delete( insertedBoloID );

            /* assert */
            return responsePromise
                .then( function ( response ) {
                    expect( response.ok ).to.be.true;
                    expect( response.id ).to.be.equal( insertedBoloID );
                });
        });
    });
});
