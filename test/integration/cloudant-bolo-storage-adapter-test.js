/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;

var path = require('path');

var src = path.resolve( __dirname, '../../src' );
var BoloFixture = require('../lib/bolo-entity-fixture');
var AdapterFactory = require( path.join( src, 'core/adapters') );


describe( 'BOLO Repository Storage Adapter', function () {

    var boloRepository;

    before( function () {
        boloRepository = AdapterFactory.create( 'storage', 'cloudant' );
    });

    it( 'promises to insert a bolo into the cloudant repository', function () {
        /* arrange */
        var bolo = BoloFixture.create();

        /* act */
        var response = boloRepository.insert( bolo );

        /* assert */
        return response
            .then( function ( body ) {
                expect( body.okay ).to.be.true;
            });
    });

});
