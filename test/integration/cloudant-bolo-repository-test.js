/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;

var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var BoloFixture = require('../lib/bolo-entity-fixture');
var AdapterFactory = require( path.join( src, 'core/adapters') );

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

    it( 'promises to #insert a bolo into the repository', function () {
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
                    expect( response.id ).to.be.equal( );
                });
        });
    });
});
