/* jshint node: true, mocha: true, expr: true */
'use strict';

var expect      = require('chai').expect;
var path        = require('path');
var Promise     = require('promise');

var src                 = path.resolve( __dirname, '../../src' );
var AdapterFactory      = require( path.join( src, 'core/adapters') );
var AgencyFixture       = require('../lib/agency-entity-fixture');
var FileFixtureFactory  = require('../lib/file-fixture-factory');

require('dotenv').config({ path: path.resolve( __dirname, '../../.env' ) });

describe( 'Cloudant Agency Repository', function () {
    var agencyRepository;
    var agency, cache;
    var imageFactory;

    this.timeout( 5000 );

    before( function () {
        agencyRepository = AdapterFactory.create( 'persistence', 'cloudant-agency-repository' );

        imageFactory = new FileFixtureFactory(
            path.resolve( __dirname, '../assets/nodejs.png' )
        );

        cache = {};
    });

    after( function () {
        return Promise.all( Object.keys( cache ).map( agencyRepository.delete ) );
    });

    beforeEach( function () {
        agency = AgencyFixture.create();
        delete agency.data.id;
    });

    describe( '#insert repository method', function () {
        it( 'promises to return the new agency object', function () {
            /* act */
            var agencyPromise = agencyRepository.insert( agency );

            /* assert */
            return agencyPromise.then( function ( newagency ) {
                expect( newagency ).to.not.equal( agency );
                expect( newagency.diff( agency ) ).to.be.length( 1 )
                    .and.to.contain( 'id' );
                cache[newagency.id] = newagency;
            });
        });

        it( 'promises to return a new agency with attachments', function () {
            /* arrange */
            var attachmentDTO = imageFactory.create( 'shield' )
            .then( function ( imageFixturePath ) {
                return [{
                    'name'          : 'shield.png',
                    'content_type'  : 'image/png',
                    'path'          : imageFixturePath
                }];
            });

            /* act */
            var agencyPromise = attachmentDTO.then( function ( attachments ) {
                return agencyRepository.insert( agency, attachments );
            });

            /* assert */
            return agencyPromise.then( function ( newagency ) {
                expect( newagency.data.attachments['shield.png'] ).to.exist;
                cache[newagency.id] = newagency;
            });
        });
    }); /* end describe: #insert repository method */

    describe( '#update repository method', function () {
        it( 'promises to return an updated agency', function () {
            /* arrange */
            var originalAgencyPromise = agencyRepository.insert( agency )
            .then( function ( insertedAgency ) {
                cache[insertedAgency.id] = insertedAgency;
                return insertedAgency;
            });

            /* act */
            var updatedAgencyPromise = originalAgencyPromise
            .then( function ( currentAgency ) {
                currentAgency.name = 'some new agency name';
                return agencyRepository.update( currentAgency );
            });

            /* assert */
            return updatedAgencyPromise.then( function ( updatedAgency ) {
                expect( updatedAgency ).to.not.equal( agency );
                expect( updatedAgency.diff( agency ) ).to.contain( 'name' );
                expect( updatedAgency.name ).to.equal( 'some new agency name' );
            });
        });

        it( 'does not clobber sttached images on update', function () {
            /* arrange */
            var agencyWithAttachment = imageFactory.create( 'shield' )
            .then( function ( imageFixturePath ) {
                var attachments = [{
                    'name'          : 'shield.png',
                    'content_type'  : 'image/png',
                    'path'          : imageFixturePath
                }];
                return agencyRepository.insert( agency, attachments );
            }).then( function ( newagency ) {
                cache[newagency.id] = newagency;
                return newagency;
            });

            /* act */
            var promise = agencyWithAttachment.then( function ( original ) {
                original.address = 'some new address';
                return agencyRepository.update( original );
            });

            /* assert */
            return promise.then( function ( updated ) {
                var original = cache[updated.id];
                expect( updated.diff( agency ) ).to.contain( 'address' );
                expect( updated.data.attachments )
                    .to.deep.equal( original.data.attachments );
            });
        });

        it( 'adds attachments to pre-existing attachments', function () {
            /* arrange */
            var agencyWithAttachment = imageFactory.create( 'shield' )
            .then( function ( imageFixturePath ) {
                var attachments = [{
                    'name': 'shield.png',
                    'content_type': 'image/png',
                    'path': imageFixturePath
                }];
                return agencyRepository.insert( agency, attachments );
            })
            .then( function ( newagency ) {
                cache[newagency.id] = newagency;
                return newagency;
            });

            var newImageAttachment = imageFactory.create( 'other-shield' )
            .then( function ( imageFixturePath ) {
                return [{
                    'name': 'other-shield.png',
                    'content_type': 'image/png',
                    'path': imageFixturePath
                }];
            });

            /* act */
            var promise = Promise.all([ agencyWithAttachment, newImageAttachment ])
            .then( function ( data ) {
                var original = data[0],
                    attachments = data[1];
                original.name = 'some agency name';
                return agencyRepository.update( original, attachments );
            });

            /* assert */
            return promise
            .then( function ( updated ) {
                expect( updated.data.attachments ).to.have.all
                    .keys([ 'shield.png', 'other-shield.png' ]);
            });
        });
    }); /* end describe: #update repository method */

    describe( '#delete repository method', function () {
        it( 'promises an error if the agency id is not found', function () {
            /* act */
            var responsePromise = agencyRepository.delete( 'non-existant-id' );

            /* assert */
            return responsePromise.then( function ( response ) {
                // test failure
            })
            .catch( function ( response ) {
                expect( response ).to.be.instanceOf( Error );
            });
        });

        it( 'promises the id and ok status', function () {
            /* arrange */
            var insertedAgencyID;

            /* act */
            var responsePromise = agencyRepository.insert( agency )
            .then( function ( newagency ) {
                insertedAgencyID = newagency.id;
                return agencyRepository.delete( insertedAgencyID );
            });

            /* assert */
            return responsePromise.then( function ( response ) {
                expect( response.ok ).to.be.true;
                expect( response.id ).to.be.equal( insertedAgencyID );
            });
        });
    }); /* end describe: #delete repository method */

    describe( '#getAttachment method', function () {
        it( 'promises an attachment', function () {
            var agencyWithAttachment = imageFactory.create( 'shield' )
            .then( function ( imageFixturePath ) {
                var attachments = [{
                    'name': 'shield.png',
                    'content_type': 'image/png',
                    'path': imageFixturePath
                }];
                return agencyRepository.insert( agency, attachments );
            })
            .then( function ( newagency ) {
                cache[newagency.id] = newagency;
                return newagency;
            });

            /* act */
            var promise = agencyWithAttachment.then( function ( _agency ) {
                return agencyRepository.getAttachment( _agency.id, 'shield.png' );
            });

            /* assert */
            return promise
            .then( function ( response ) {
                expect( response.name ).to.be.equal( 'shield.png' );
                expect( response.content_type ).to.be.equal( 'image/png' );
                expect( response.data ).to.be.instanceOf( Buffer );
            });
        });
    }); /* end describe: #getAttachment method */
});
