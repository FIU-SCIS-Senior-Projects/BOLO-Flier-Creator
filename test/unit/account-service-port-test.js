/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var path = require('path');

var src = path.resolve( __dirname, '../../src' );
var AccountService = require( path.join( src, 'core/ports/account-service-port' ) );
var UserFixture = require( '../lib/user-entity-fixture' );


describe( 'account service port', function () {

    var accountService;
    var mockUserRepo;
    var user;

    beforeEach( function () {
        user = UserFixture.create();
        mockUserRepo = {};
        accountService = new AccountService( mockUserRepo );
    });

    it( 'authenticates the validity of user credentials', function () {
        /* arrange */
        var stub = mockUserRepo.getByUsername = sinon.stub();
        stub.withArgs( sinon.match.string ).returns( user );
        var username = 'superhacker',
            password = 'hackersuper';

        /* act */
        var response = accountService.authenticate( username, password );

        /* assert */
        expect( response ).to.equal( user );
    });

});
