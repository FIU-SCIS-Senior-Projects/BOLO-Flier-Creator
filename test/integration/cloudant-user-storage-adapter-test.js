/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;

var fs = require('fs');
var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var UserFixture = require('../lib/user-entity-fixture');
var AdapterFactory = require( path.join( src, 'core/adapters' ) );


/* == Test Spec ============================================================= */
describe( 'cloudant user storage adapter', function () {
    var user, insertedUserID;
    var userRepository;

    before( function () {
        userRepository = AdapterFactory.create( 'storage', 'cloudant-user' );
    });

    after( function () {
    });

    beforeEach( function () {
        user = UserFixture.create();
    });

    it( 'inserts a user', function () {
        /* act */
        var userPromise = userRepository.insert( user );

        /* assert */
        return userPromise
            .then( function ( newuser ) {
                expect( user.diff( newuser ) ).to.be.length( 1 )
                    .and.to.contain( 'id' );
                insertedUserID = newuser.data.id;
            });
    });

    it( 'gets a single user by id', function () {
        /* act */
        var userPromise = userRepository.getById( insertedUserID );

        /* assert */
        return userPromise
            .then( function ( user ) {
                expect( user.data.id ).to.equal( insertedUserID );
            });
    });

    it( 'removes a user', function () {
        /* act */
        var responsePromise = userRepository.remove( insertedUserID );

        /* assert */
        return responsePromise
            .then( function ( response ) {
                expect( response.ok ).to.be.true;
                expect( response.id ).to.be.equal( insertedUserID );
            });
    });

});
