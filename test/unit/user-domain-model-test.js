/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var path = require('path');

var src = path.resolve( __dirname, '../../src' );
var User = require( path.join( src, 'core/domain/user' ) );


describe( 'user domain entity', function () {

    var user;
    var defaultUserData;

    before( function () {
        defaultUserData = {
            'id'            : '234dsflj3242lj',
            'username'      : 'tron',
            'password'      : 'tron2015',
            'fname'         : 'Kevin',
            'lname'         : 'Flynn',
            'agency'        : 'Pinecrest',
            'tier'          : 1
        };
    });

    beforeEach( function () {
        user = new User( defaultUserData );
    });

    it( 'object data is created as a fresh object', function () {
        /* arrange */
        var other = new User( user.data );

        /* assert */
        expect( other.data ).to.not.equal( user.data );
    });

    describe( 'when comapring user objects', function () {

        var other;

        beforeEach( function () {
            other = new User( defaultUserData );
        });

        it( 'returns an array of differing attributes', function () {
            /* arrange */
            other.data.id = 'crappyID';

            /* act */
            var diff = user.diff( other );

            /* assert */
            expect( diff ).to.contain( 'id' );
        });

        it( 'checks equality of objects by own attributes', function () {
            /* arrange */
            other.data.tier = 2;

            /* act */
            var result = user.same( other );

            /* assert */
            expect( result ).to.be.false;
        });

    }); /* when comparing user objects */

});
