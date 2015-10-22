/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var AccountService = require( path.join( src, 'core/ports/account-service-port' ) );
var UserFixture = require( '../lib/user-entity-fixture' );


describe( 'account service port', function () {

    var accountService;
    var mockUserRepo;

    beforeEach( function () {
        mockUserRepo = {};
        accountService = new AccountService( mockUserRepo );
    });

    describe( 'authenticates user credentials', function () {
        var user;

        beforeEach( function () {
            user = UserFixture.create();
        });

        it( 'promises a User object for valid credentials', function () {
            /* arrange */
            var username    = user.data.username,
                password    = user.data.password;

            mockUserRepo.getByUsername = sinon.stub()
                .withArgs( user.data.username )
                .returns( Promise.resolve( user ) );

            /* act */
            var response = accountService.authenticate( username, password );

            /* assert */
            return response
                .then( function ( authUser ) {
                    expect( authUser ).to.equal( user );
                });
        });

        it( 'promises a null for invalid password', function () {
            /* arrange */
            var username    = user.data.username,
                password    = 'a wrong password';

            mockUserRepo.getByUsername = sinon.stub()
                .withArgs( user.data.username )
                .returns( Promise.resolve( user ) );

            /* act */
            var response = accountService.authenticate( username, password );

            /* assert */
            return response
                .then( function ( authUser ) {
                    expect( authUser ).to.equal( null );
                });
        });

        it( 'promises a null for invlid usernames', function () {
            /* arrange */
            var username    = 'nonexistent_username',
                password    = user.data.password;

            mockUserRepo.getByUsername = sinon.stub()
                .withArgs( username )
                .returns( Promise.resolve( null ) );

            /* act */
            var response = accountService.authenticate( username, password );

            /* assert */
            return response
                .then( function ( authUser ) {
                    expect( authUser ).to.equal( null );
                });
        });
    }); /* end describe: authenticates user credentials */

    describe( 'deserializes user ids', function () {
        var user;

        beforeEach( function () {
            user = UserFixture.create();
        });

        it( 'promises user entity object for valid ids', function () {
            /* arrange */
            var id = user.data.id = 'abc123';

            mockUserRepo.getById = sinon.stub()
                .withArgs( id )
                .returns( Promise.resolve( user ) );

            /* act */
            var response = accountService.deserializeUser( id );

            /* assert */
            return response
                .then( function ( found ) {
                    expect( found.data.id ).to.equal( id );
                });
        });
    }); /* end describe: retrieves user accounts */

});
