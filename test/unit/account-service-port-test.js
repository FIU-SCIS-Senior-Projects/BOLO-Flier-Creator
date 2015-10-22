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
        it( 'promises a User object for valid credentials', function () {
            /* arrange */
            var user        = UserFixture.create();
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

        it.skip( 'promises a null for invalid credentials', function () {
        });
    }); /* end describe: authenticates user credentials */

});
