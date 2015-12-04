/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var _ = require('lodash');
var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var User = require( path.join( src, 'core/domain/user' ) );
var UserService = require( path.join( src, 'core/service/user-service' ) );
var UserFixture = require( '../lib/user-entity-fixture' );


describe( 'user service module', function () {

    var userService;
    var mockUserRepo;
    var user;

    var defaultStubMethod = function () {
        throw new Error( 'Stub behavior undefined' );
    };

    before( function () {
    });

    beforeEach( function () {
        mockUserRepo = {
            'insert': defaultStubMethod,
            'update': defaultStubMethod,
            'getByUsername': defaultStubMethod,
            'getById': defaultStubMethod
        };
        userService = new UserService( mockUserRepo );
        user = UserFixture.create();
    });

    describe( 'authenticates user credentials', function () {
        it( 'promises a User object for valid credentials', function () {
            /* arrange */
            var username    = user.username,
                password    = user.password;

            user.hashPassword();

            mockUserRepo.getByUsername = sinon.stub()
                .withArgs( user.username )
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

    describe( 'registering new users', function () {
        var storedUser;

        beforeEach( function () {
            storedUser = UserFixture.create({ 'id': 'abc123' });

            sinon.stub( mockUserRepo, 'insert' )
                .withArgs( sinon.match.instanceOf( User ) )
                .returns( Promise.resolve( storedUser ) );
        });

        it( 'promises a User object for valid registrations', function () {
            /* arrange */
            sinon.stub( mockUserRepo, 'getByUsername' )
                .withArgs( sinon.match.string )
                .returns( Promise.resolve( null ) );

            /* act */
            var registrationPromise = userService.registerUser( user.data );

            /* assert */
            return registrationPromise
                .then( function ( response ) {
                    expect( response ).to.be.instanceOf( User );
                    expect( response ).to.equal( storedUser );
                });
        });

        it( 'rejects when the username already exists', function () {
            /* arrange */
            sinon.stub( mockUserRepo, 'getByUsername' )
                .withArgs( user.data.username )
                .returns( Promise.resolve( storedUser ) );

            /* act */
            var registrationPromise = userService.registerUser( user.data );

            /* assert */
            return registrationPromise
                .then(function ( response ) {
                    expect( response ).to.be.undefined;
                }, function ( response ) {
                    expect( response ).to.be.instanceOf( Error )
                    .and.to.match( /already registered/ );
                });
        });
    }); /* end describe: registers new users */

    describe( 'updating user data', function () {
        var storedUser;

        beforeEach( function () {
            storedUser = UserFixture.create();
            sinon.stub( mockUserRepo, 'update', function ( user ) {
                return Promise.resolve ( user );
            });
        });

        it( 'modifies user data in the configured repository', function () {
            /* arrange */
            var userID = '46';
            var userDTO = userService.formatDTO({
                'email': 'robocop@cybernetics-dpd.gov'
            });

            storedUser.data.id = userID;
            storedUser.data.email = 'some-email@example.com';

            sinon.stub( mockUserRepo, 'getById' )
                .withArgs( userID )
                .returns( Promise.resolve( storedUser ) );

            /* act */
            var updatePromise = userService.updateUser( userID, userDTO );

            /* assert */
            return updatePromise.then( function ( response ) {
                expect( storedUser.data.email ).to.equal( userDTO.email );
            });
        });

        it( 'promises the modified User object', function () {
            var userID = '46';
            var userDTO = userService.formatDTO({
                'email': 'robocop@cybernetics-dpd.gov'
            });

            storedUser.data.id = userID;
            storedUser.data.email = 'some-email@example.com';

            sinon.stub( mockUserRepo, 'getById' )
                .withArgs( userID )
                .returns( Promise.resolve( storedUser ) );

            /* act */
            var updatePromise = userService.updateUser( userID, userDTO );

            /* assert */
            return updatePromise.then( function ( response ) {
                expect( response ).to.be.an.instanceOf( User );
                expect( response.diff( storedUser ) ).to.be.be.length( 0 );
            });
        });
    }); /* end describe: updating user data */

});
