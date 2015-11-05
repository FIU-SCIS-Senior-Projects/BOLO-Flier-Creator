/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect = require('chai').expect;

var path = require('path');
var Promise = require('promise');

var src = path.resolve( __dirname, '../../src' );
var BoloFixture = require('../lib/bolo-entity-fixture');
var AdapterFactory = require( path.join( src, 'core/adapters') );
var FileFixtureFactory = require('../lib/file-fixture-factory.js');

require('dotenv').config({ path: path.resolve( __dirname, '../../.env' ) });

describe( 'BOLO Repository Storage Adapter', function () {
    var boloRepository;
    var bolo, cache;
    var imageFactory;

    this.timeout( 5000 );

    before( function () {
        boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );

        imageFactory = new FileFixtureFactory(
            path.resolve( __dirname, '../assets/nodejs.png' )
        );

        cache = {};
    });

    after( function () {
        imageFactory.shutitdown();
        return Promise.all( Object.keys( cache ).map( boloRepository.delete ) );
    });

    beforeEach( function () {
        bolo = BoloFixture.create();
        delete bolo.data.id;
    });

    describe( '#insert method repository method', function () {
        it( 'promises to return the bolo', function () {
            /* act */
            var boloPromise = boloRepository.insert( bolo );

            /* assert */
            return boloPromise
                .then( function ( newbolo ) {
                    expect( newbolo.diff( bolo ) ).to.be.length( 1 )
                        .and.to.contain( 'id' );
                    cache[newbolo.data.id] = newbolo;
                });
        });

        it( 'promises to return a new bolo with attachments', function () {
            /* arrange */
            var attachmentDTO = imageFactory.create( 'suspect' )
                .then( function ( imageFixturePath ) {
                    return [{
                        'name': 'suspect.png',
                        'content_type': 'image/png',
                        'path': imageFixturePath
                    }];
                });

            /* act */
            var boloPromise = attachmentDTO
                .then( function ( attachments ) {
                    return boloRepository.insert( bolo, attachments );
                });

            /* assert */
            return boloPromise
                .then( function ( newbolo ) {
                    expect( newbolo.data.attachments['suspect.png'] ).to.exist;
                    cache[newbolo.data.id] = newbolo;
                });
        });
    }); /* end describe: #insert method */

    describe( '#update method' , function () {
        it( 'promises to return an updated bolo', function () {
            /* arrange */
            var originalBoloPromise = boloRepository.insert( bolo )
                .then( function ( insertedBolo ) {
                    cache[insertedBolo.data.id] = insertedBolo;
                    return insertedBolo;
                });

            /* act */
            var updatedBoloPromise = originalBoloPromise
                .then( function ( currentBolo ) {
                    currentBolo.data.category = 'some category';
                    return boloRepository.update( currentBolo );
                });

            /* assert */
            return updatedBoloPromise
                .then( function ( updatedBolo ) {
                    expect( updatedBolo.diff( bolo ) ).to.contain( 'category' );
                });
        });

        it( 'does not clobber attached images on update', function () {
            /* arrange */
            var boloWithAttachment = imageFactory.create( 'suspect' )
                .then( function ( imageFixturePath ) {
                    return [{
                        'name': 'suspect.png',
                        'content_type': 'image/png',
                        'path': imageFixturePath
                    }];
                })
                .then( function ( attachments ) {
                    return boloRepository.insert( bolo, attachments );
                })
                .then( function ( newbolo ) {
                    cache[newbolo.data.id] = newbolo;
                    return newbolo;
                });

            /* act */
            var promise = boloWithAttachment
                .then( function ( original ) {
                    original.data.summary = 'some new summary';
                    return boloRepository.update( original );
                });

            /* assert */
            return promise
                .then( function ( updated ) {
                    var original = cache[updated.data.id];
                    expect( updated.diff( bolo ) ).to.contain( 'summary' );
                    expect( updated.data.attachments )
                        .to.deep.equal( original.data.attachments );
                });
        });

        it( 'adds attachments to pre-existing attachments', function () {
            /* arrange */
            var boloWithAttachment = imageFactory.create( 'suspect' )
                .then( function ( imageFixturePath ) {
                    return [{
                        'name': 'suspect.png',
                        'content_type': 'image/png',
                        'path': imageFixturePath
                    }];
                })
                .then( function ( attachments ) {
                    return boloRepository.insert( bolo, attachments );
                })
                .then( function ( newbolo ) {
                    cache[newbolo.data.id] = newbolo;
                    return newbolo;
                });

            var newImageAttachment = imageFactory.create( 'other-suspect' )
                .then( function ( imageFixturePath ) {
                    return [{
                        'name': 'other-suspect.png',
                        'content_type': 'image/png',
                        'path': imageFixturePath
                    }];
                });

            /* act */
            var promise = Promise.all([ boloWithAttachment, newImageAttachment ])
                .then( function ( data ) {
                    var original = data[0],
                        attachments = data[1];
                    original.data.summary = 'some new summary';
                    return boloRepository.update( original, attachments );
                });

            /* assert */
            return promise
                .then( function ( updated ) {
                    expect( updated.data.attachments ).to.have.all
                        .keys([ 'suspect.png', 'other-suspect.png' ]);
                });
        });
    }); /* end describe: #update method */

    describe( '#delete method', function () {
        it( 'promises an error if the bolo id is not found', function () {
            /* act */
            var responsePromise = boloRepository.delete( 'non-existant-id' );

            /* assert */
            return responsePromise
                .then( function ( response ) {
                    // test failure
                })
                .catch( function ( response ) {
                    expect( response ).to.be.instanceOf( Error );
                });
        });

        it( 'promises the id and ok status', function () {
            /* arrange */
            var insertedBoloID;

            /* act */
            var responsePromise = boloRepository.insert( bolo )
                .then( function ( newbolo ) {
                    insertedBoloID = newbolo.data.id;
                    return boloRepository.delete( insertedBoloID );
                });

            /* assert */
            return responsePromise
                .then( function ( response ) {
                    expect( response.ok ).to.be.true;
                    expect( response.id ).to.be.equal( insertedBoloID );
                });
        });
    }); /* end describe: #delete method */

    describe( '#getAttachment method', function () {
        it( 'promises an attachment', function () {
            var boloWithAttachment = imageFactory.create( 'suspect' )
                .then( function ( imageFixturePath ) {
                    return [{
                        'name': 'suspect.png',
                        'content_type': 'image/png',
                        'path': imageFixturePath
                    }];
                })
                .then( function ( attachments ) {
                    return boloRepository.insert( bolo, attachments );
                })
                .then( function ( newbolo ) {
                    cache[newbolo.data.id] = newbolo;
                    return newbolo;
                });

            /* act */
            var promise = boloWithAttachment
                .then( function ( theBolo ) {
                    return boloRepository.getAttachment( theBolo.data.id, 'suspect.png' );
                });

            /* assert */
            return promise
                .then( function ( response ) {
                    expect( response.name ).to.be.equal( 'suspect.png' );
                    expect( response.content_type ).to.be.equal( 'image/png' );
                    expect( response.data ).to.be.instanceOf( Buffer );
                });
        });
    }); /* end describe: #getAttachment method */
});
