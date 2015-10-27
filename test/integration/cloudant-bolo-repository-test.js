/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;

var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var BoloFixture = require('../lib/bolo-entity-fixture');
var AdapterFactory = require( path.join( src, 'core/adapters') );

require('dotenv').config({ path: path.resolve( '../../.env' ) });

describe( 'BOLO Repository Storage Adapter', function () {
    var bolo, insertedBoloID;
    var boloRepository;

    before( function () {
        boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    });

    beforeEach( function () {
        bolo = BoloFixture.create();
    });

    it( 'promises to #add a bolo into the repository', function () {
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


    it( 'promises to #delete a bolo from the repository', function () {
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
