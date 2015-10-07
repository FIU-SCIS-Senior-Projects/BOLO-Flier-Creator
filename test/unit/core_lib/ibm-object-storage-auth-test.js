/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var nock = require('nock');
var path = require('path');
var sinon = require('sinon');
var url = require('url');

var src_dir = path.resolve( __dirname, '../../../src/core/lib/ibm-object-storage' );
var Auth = require( path.join( src_dir, 'auth' ) );

var env_state = {};

/* == Helper Methods ======================================================== */
var envClean = function ( key ) { delete process.env[key]; };
var envCache = function ( key ) { if ( process.env[key] ) env_state[key] = process.env[key]; };
var envRestore = function ( key ) { process.env[key] = env_state[key]; };


/* == Test Spec ============================================================= */
describe( 'object store Auth module', function () {
    var AUTH_HOST = 'http://www.example.com/auth';
    var AUTH_ACCT = 'some-account';
    var MODIFIED_ENV = [
        'OSTORE_AUTH_UN', 'OSTORE_AUTH_PW', 'OSTORE_AUTH_URI',
        'VCAP_SERVICES'
    ];

    before( function () {
        MODIFIED_ENV.map( envCache );
    });

    after( function () {
        Object.keys( env_state ).map( envRestore );
    });

    describe( '.config methods', function () {
        afterEach( function () {
            MODIFIED_ENV.map( envClean );
        });

        it( '.config returns a read-only config object', function () {
            /* arrange */
            var conf = Auth.config({
                username: 'randomUsername',
                password: 'asd34lfs2@@X%$',
                auth_uri: AUTH_HOST
            });

            /* assert */
            Object.keys( conf ).map( function ( key ) {
                var fn = function () { conf[key] = 'random'; };
                expect( fn ).to.throw( TypeError );
            });
        });

        it( '.configFromEnvironment reads from process.env', function () {
            /* arrange */
            process.env.OSTORE_AUTH_UN = 'super secret username';
            process.env.OSTORE_AUTH_PW = 'super secret password';
            process.env.OSTORE_AUTH_URI = AUTH_HOST;

            /* act */
            var conf = Auth.configFromEnvironment();

            /* assert */
            expect( conf ).to.have.property( 'username', process.env.OSTORE_AUTH_UN );
            expect( conf ).to.have.property( 'password', process.env.OSTORE_AUTH_PW);
            expect( conf ).to.have.property( 'auth_uri', process.env.OSTORE_AUTH_URI);
            expect( conf.secret ).to.match( /^Basic [\/+= a-z0-9]*$/i );
        });

        it( '.configFromBluemix reads from VCAP_SERVICES', function () {
            /* arrange */
            process.env.VCAP_SERVICES = JSON.stringify({
                objecetstorage: [{
                    credentials: {
                        username: 'super secret username',
                        password: 'super secret password',
                        auth_uri: AUTH_HOST
                    }
                }]
            });

            /* act */
            var conf = Auth.configFromEnvironment();

            /* assert */
            expect( conf ).to.have.property( 'username', process.env.OSTORE_AUTH_UN );
            expect( conf ).to.have.property( 'password', process.env.OSTORE_AUTH_PW);
            expect( conf ).to.have.property( 'auth_uri', process.env.OSTORE_AUTH_URI);
            expect( conf.secret ).to.match( /^Basic [\/+= a-z0-9]*$/i );
        });
    }); /* end describe .configure */

    describe( '.buildToken method', function (){
        var response_header = {
            'x-auth-token': 'my-token',
            'x-storage-url': 'my-url'
        };

        it( 'return object has a expected property keys', function () {
            /* act */
            var token = Auth.buildToken( response_header );

            /* assert */
            expect( token ).to.have.property( 'token', 'my-token' );
            expect( token ).to.have.property( 'url', 'my-url' );
        });

        it( 'return token object is read-only', function () {
            /* act */
            var token = Auth.buildToken( response_header );

            /* assert */
            Object.keys( token ).map( function ( key ) {
                var fn = function () { token[key] = 'random'; };
                expect( fn ).to.throw( TypeError, null, 'token not immutable' );
            });
        });

    }); /* end describe .buildToken */

    describe( '.getToken method', function (){
        var conf, api_proxy;
        var account, authStub;

        beforeEach( function () {
            account = 'some-account';

            conf = Auth.config({
                username: 'randomUsername',
                password: 'asd34lfs2@@X%$',
                auth_uri: AUTH_HOST
            });

            api_proxy = nock( AUTH_HOST ).get( '/' + account );
        });

        afterEach( function () {
            nock.cleanAll();
        });

        it( 'promises token object on success', function () {
            /* arrange */
            authStub = sinon.stub( Auth, 'buildToken' );
            authStub.returns( 'mock token object' );
            api_proxy.reply( 200, 'OK', { 'X-Meta-Name': 'ab123' } );

            /* act */
            var promise = Auth.getToken( account, conf );

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.equal( 'mock token object' );
                authStub.restore();
            });
        });

        it( 'returns an Error on http error with status code', function () {
            /* arrange */
            api_proxy.reply( 404, 'Not Found' );

            /* act */
            var promise = Auth.getToken( account, conf );

            /* assert */
            return promise.catch( function ( error ) {
                expect( error ).to.be.instanceOf( Error )
                .and.to.match( /404 status code/i );
            });
        });
    }); /* end describe .getToken */
});
