/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var User = require( path.join( src, 'core/domain/user' ) );
var UserService = require( path.join( src, 'core/service/user-service' ) );
var UserFixture = require( '../lib/user-entity-fixture' );


describe( 'user service port', function () {

    var userService;
    var mockUserRepo;
    var user;

    beforeEach( function () {
        mockUserRepo = {};
        userService = new UserService( mockUserRepo );
        user = UserFixture.create();
    });

    describe( 'authenticates user credentials', function () {
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

    describe( 'registers new users', function () {
        it( 'promises User object for valid registrations', function () {
            /* arrange */
            var userDTO = user.data;

            /* act */
            var registrationPromise = userService.registerUser( userDTO );

            /* assert */
            return registrationPromise
                .then( function ( response ) {
                    expect( response ).to.be.instanceOf( User );
                    expect( response.diff( user ) ).to.contain( 'id' );
                });
        });
    }); /* end describe: registers new users */

});
