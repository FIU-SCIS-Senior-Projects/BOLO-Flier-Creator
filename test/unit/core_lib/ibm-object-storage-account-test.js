/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;
var nock = require('nock');
var path = require('path');
var sinon = require('sinon');
var url = require('url');


var src_dir = path.resolve( __dirname, '../../../src/core/lib/ibm-object-storage' );
var Account = require( path.join( src_dir, 'account' ) );
var Container = require( path.join( src_dir, 'container' ) );


describe( 'object storage Account class', function () {
    var token, account;
    var API_HOST = 'http://www.example.com';
    var API_ACCT = '/v1/account_id';

    before( function () {
        token = {
            url: API_HOST + API_ACCT,
            token: 'AUTH_abcdef1234567890'
        };
    });

    beforeEach( function () {
        account = new Account( token );
    });

    describe( '#req_opts method', function () {
        it( 'cannot be statically invoked', function () {
            /* assert */
            expect( Account ).to.not.respondTo( 'req_opts' );
        });

        it( 'returns a request options object with values from the token', function () {
            /* arrange */
            var expected = {
                url : token.url,
                headers : {
                    'Accept' : 'application/json',
                    'X-Auth-Token' : token.token
                }
            };

            /* act */
            var opts = account.req_opts();

            /* assert */
            expect( opts ).to.deep.equal( expected );
        });
    }); /* end describe #req_opts */

    /** @link http://developer.openstack.org/api-ref-objectstorage-v1.html#resp-json-d88e401 */
    describe( '#info method', function () {
        var api_proxy;

        beforeEach( function () {
            api_proxy = nock( API_HOST ).get( API_ACCT );
        });

        it( 'promises a header body JSON object', function () {
            /* arrange */
            var body = [
                { "count": 0, "bytes": 0, "name": "janeausten" },
                { "count": 1, "bytes": 14, "name": "marktwain" }
            ];
            api_proxy.reply( 200, JSON.stringify( body ) );

            /* act */
            var promise = account.info();

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.deep.equal( body );
            });
        });

        it( 'returns an Error on http errors with status code', function () {
            /* arrange */
            api_proxy.reply( 404,  { msg: 'nocked...' } );

            /* act */
            var promise = account.info();

            /* assert */
            return promise.catch( function ( error ) {
                expect( error ).to.be.instanceOf( Error )
                .and.to.match( /404 http status/ );
            });
        });
    }); /* end describe #info */

    describe( '#createContainer method', function () {
        var container = 'some-container';
        var api_proxy;

        beforeEach( function () {
            api_proxy = nock( API_HOST ).put( API_ACCT + '/' +  container );
        });

        afterEach( function () {
            nock.cleanAll();
        });

        it( 'promises a Container instance on success', function () {
            /* arrange */
            api_proxy.reply( 201 );

            /* act */
            var promise = account.createContainer( container );

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.be.instanceOf( Container );
            });
        });

        it( 'promises an Error on http errors with a status code', function () {
            /* arrange */
            api_proxy.reply( 403, 'Forbidden' );

            /* act */
            var promise = account.createContainer( container );

            /* assert */
            return promise.catch( function ( error ) {
                expect( error ).to.be.instanceOf( Error )
                .and.to.match( /403 http status/ );
            });
        });
    }); /* end describe #createContainer */

    describe( '#hasContainer methods', function () {
        var container = 'some-container';
        var api_proxy;

        beforeEach( function () {
            api_proxy = nock( API_HOST ).get( API_ACCT + '/' +  container );
        });

        afterEach( function () {
            nock.cleanAll();
        });

        it( 'promises true if the container is found', function () {
            /* arrange */
            api_proxy.reply( 200,  { msg: 'nocked...' } );

            /* act */
            var promise = account.hasContainer( container );

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.be.true;
            });
        });

        it( 'promises false if the container is _not_ found', function () {
            /* arrange */
            api_proxy.reply( 404,  { msg: 'nocked...' } );

            /* act */
            var promise = account.hasContainer( container );

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.be.false;
            });
        });

        it( 'returns an Error on http errors with status code', function () {
            /* arrange */
            api_proxy.reply( 403,  { msg: 'nocked...' } );

            /* act */
            var promise = account.hasContainer( container );

            /* assert */
            return promise.catch( function ( error ) {
                expect( error ).to.be.instanceOf( Error )
                .and.to.match( /403 http status/ );
            });
        });
    }); /* end describe #hasContainer */

    describe( '#useContainer method', function () {
        var container = 'some-container';
        var api_proxy;

        beforeEach( function () {
            api_proxy = nock( API_HOST ).get( API_ACCT + '/' + container );
        });

        afterEach( function () {
            nock.cleanAll();
        });

        it( 'checks if the container exists', function () {
            /* arrange */
            var spy = sinon.spy( account, 'hasContainer' );
            api_proxy.reply( 200, 'OK' );

            /* act */
            var promise = account.useContainer( container );

            /* assert */
            return promise.then( function ( val ) {
                expect( spy.calledWith( container ) ).to.be.true;
            });
        });

        it( 'promises a Container instance on success', function () {
            /* arrange */
            api_proxy.reply( 200, 'OK' );  // hasContainer state

            /* act */
            var promise = account.useContainer( container );

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.be.instanceOf( Container );
            });
        });

        it( 'promises an Error when the Container does not exist', function () {
            /* arrange */
            api_proxy.reply( 404, 'Not Found' );

            /* act */
            var promise = account.useContainer( container );

            /* assert */
            return promise.catch( function ( error ) {
                expect( error ).to.be.instanceOf( Error )
                .and.to.match( /does not exist/ );
            });
        });
    }); /* end describe #useContainer */
});

