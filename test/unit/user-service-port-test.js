/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var UserService = require( path.join( src, 'core/ports/user-service-port' ) );
var UserFixture = require( '../lib/user-entity-fixture' );


describe( 'user service port', function () {

    var userService;
    var mockUserRepo;

    beforeEach( function () {
        mockUserRepo = {};
        userService = new UserService( mockUserRepo );
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
            var response = userService.authenticate( username, password );

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
            var response = userService.authenticate( username, password );

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
            var response = userService.authenticate( username, password );

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

        it( 'promises User object for valid ids', function () {
            /* arrange */
            var id = user.data.id = 'abc123';

            mockUserRepo.getById = sinon.stub()
                .withArgs( id )
                .returns( Promise.resolve( user ) );

            /* act */
            var response = userService.deserializeId( id );

            /* assert */
            return response
                .then( function ( found ) {
                    expect( found.data.id ).to.equal( id );
                });
        });

        it( 'promises null object for invalid ids', function () {
            /* arrange */
            var id = 'abc123';

            mockUserRepo.getById = sinon.stub()
                .withArgs( id )
                .returns( Promise.resolve( null ) );

            /* act */
            var response = userService.deserializeId( id );

            /* assert */
            return response
                .then( function ( found ) {
                    expect( found ).to.be.null;
                });
        });
    }); /* end describe: deserializes ids to user objects  */

});
