/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var path = require('path');

var src_dir = path.resolve( __dirname, '../../src' );
var Bolo = require( path.join( src_dir, 'core/domain/bolo' ) );
var BoloFixture = require( '../lib/bolo-entity-fixture' );

describe('bolo domain entity', function () {

    var bolo;

    before( function () {
    });

    beforeEach( function () {
        bolo = BoloFixture.create();
    });

    it( 'does not reference passed in data', function () {
        /* arrange */
        var other = new Bolo( bolo.data );

        /* assert */
        expect( other.data ).to.not.equal( bolo.data );
    });

    it( '#isValid validates stored data', function () {
        bolo.data.agency = '';
        expect( bolo.isValid() ).to.be.false;
    });

    it( '#same compares attribute values to other bolos', function () {
        /* arrange */
        var other = BoloFixture.create();
        other.data.id = 'some-random-id';

        /* act */
        var result = bolo.same( other );

        /* assert */
        expect( result ).to.be.false;
    });

    it( '#diff returns an array of differing attributes', function () {
        /* arrange */
        var other = BoloFixture.create();
        other.data.id = 'some-random-id';

        /* act */
        var diff = bolo.diff( other );

        /* assert */
        expect( diff ).to.contain( 'id' );
    });
});
