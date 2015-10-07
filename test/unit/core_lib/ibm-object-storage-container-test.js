/* jshint node: true, mocha: true, expr: true, -W069 */
'use strict';

var expect = require('chai').expect;
var nock = require('nock');
var path = require('path');
var stream = require('stream');
var url = require('url');


var src_dir = path.resolve( __dirname, '../../../src/core/lib/ibm-object-storage' );
var Account = require( path.join( src_dir, 'account' ) );
var Container = require( path.join( src_dir, 'container' ) );


describe('object storage Container class', function () {
    var container_name, container;
    var stubAccount, acct_opts;
    var API_HOST;

    before( function () {
        API_HOST = 'http://www.example.com/v1/some-account';
        container_name = 'some-container';
        acct_opts = { url: API_HOST };
        stubAccount = {
            req_opts : function () { return Object.create( acct_opts ); }
        };
    });

    beforeEach( function () {
        container = new Container( container_name, stubAccount );
    });

    it( 'saves its name to a read-only property', function () {
        expect( container ).to.have.property( 'name', container_name );
    });

    describe( '#req_opts method', function () {
        it( 'returns request options based on account options', function () {
            /* act */
            var opts = container.req_opts();

            /* assert */
            expect( opts ).to.have
                .property( 'url', acct_opts.url + '/' + container_name );
        });
    }); /* end describe #req_opts */

    describe( '#list method', function () {
        var api_proxy, api_list;

        before( function () {
            api_list = [
                {
                    "hash": "451e372e48e0f6b1114fa0724aa79fa1",
                    "last_modified": "2014-01-15T16:41:49.390270",
                    "bytes": 14,
                    "name": "goodbye",
                    "content_type": "application/octet-stream"
                },
                {
                    "hash": "ed076287532e86365e841e92bfc50d8c",
                    "last_modified": "2014-01-15T16:37:43.427570",
                    "bytes": 12,
                    "name": "helloworld",
                    "content_type": "application/octet-stream"
                }
            ];
        });

        beforeEach( function () {
            api_proxy = nock( API_HOST ).get( '/' + container_name );
        });

        it( 'promises an array of stored object info on success', function () {
            /* arrange */
            api_proxy.reply( 200, JSON.stringify( api_list ) );

            /* act */
            var promise = container.list();

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.deep.equal( api_list );
            });
        });

        it.skip( 'accepts options for `limit` and `marker`', function () {
            /* arrange */
            api_proxy.reply( 200, 'OK' );

            /* act */
            var promise = container.list({ limit: 1, marker: 'object_name' });

            /* assert */
            return promise.then( function ( val ) {
                // TODO
            });
        });

        it( 'returns an Error on http error with status code', function () {
            /* arrange */
            api_proxy.reply( 500, 'Random Error' );

            /* act */
            var promise = container.list();

            /* assert */
            return promise.catch( function ( error ) {
                expect( error ).to.be.instanceOf( Error )
                .and.to.match( /500 status code/i );
            });
        });
    }); /* end describe #list */

    describe.skip( '#createObject method', function () {
        var name, filename, bufferStream;
        var api_proxy;

        beforeEach( function () {
            name = 'random-uuid-string';
            filename = 'image.jpg';
            bufferStream = new stream.PassThrough();
            api_proxy = nock( API_HOST ).put( '/' + name );
        });

        it( 'promises response headers on success', function () {
            /* arrange */
            api_proxy.reply( 201, 'Created' );

            /* act */
            var promise = container.createObject( name, bufferStream, filename );
            bufferStream.end( new Buffer( 'some data') );

            /* assert */
            return promise.then( function ( val ) {
                expect( val ).to.be.okay;
            });
        });

        it( 'returns an Error on http error with status code', function () {
            /* arrange */
            api_proxy.reply( 422, 'Unprocessable' );

            /* act */
            var promise = container.createObject( name, bufferStream, filename );
            bufferStream.end( new Buffer( 'some data') );

            /* assert */
            return promise.catch( function ( error ) {
                expect( error ).to.be.instanceOf( Error )
                .and.to.match( /422 status code/i );
            });
        });
    }); /* end describe #createObject */
});
