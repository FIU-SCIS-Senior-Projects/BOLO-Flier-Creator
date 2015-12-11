/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var path = require('path');

process.env.PASSWORD_SALT = 'abc123';
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

    it( 'can hash the password attribute', function () {
        /* arrange */
        user.password = 'some-password';
        user.hashPassword();

        /* assert */
        expect( user.password ).to.not.equal( 'some-password' );
    });

    it( 'does not validate unhashed passwords', function () {
        /* arrange */
        user.password = 'abracadabra';

        /* assert */
        expect( user.isValidPassword( 'abracadabra' ) ).to.be.false;
    });

    it( 'validates hashed passwords', function () {
        /* arrange */
        user.password = 'abracadabra';
        user.hashPassword();

        /* assert */
        expect( user.isValidPassword( 'some-password' ) ).to.be.false;
        expect( user.isValidPassword( 'abracadabra' ) ).to.be.true;
    });

    describe( 'roles', function () {
        it( '#roleNames returns an array of all roles', function () {
            /* assert */
            expect( User.roleNames() ).to.be.an( 'array' );
        });

        it( 'can be referenced statically', function () {
            /* assert */
            User.roleNames().forEach( function ( role ) {
                expect( User[role] ).to.be.exist;
            });
        });
    }); /* end describe: roles */

    describe( 'when comapring user objects', function () {
        var other;

        beforeEach( function () {
            other = new User( defaultUserData );
        });

        it( 'returns an array of differing attributes', function () {
            /* arrange */
            other.id = 'crappyID';

            /* act */
            var diff = user.diff( other );

            /* assert */
            expect( diff ).to.contain( 'id' );
        });

        it( 'checks equality of objects by own attributes', function () {
            /* arrange */
            other.tier = 2;

            /* act */
            var result = user.same( other );

            /* assert */
            expect( result ).to.be.false;
        });
    }); /* when comparing user objects */

});
