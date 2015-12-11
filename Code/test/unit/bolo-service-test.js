/* jshint node: true, mocha: true, expr:true */
'use strict';

var _ = require('lodash');
var expect = require('chai').expect;
var path = require('path');
var Promise = require('promise');

var src_dir = path.join( __dirname, '../../src' );
var BoloService = require( path.join( src_dir, 'core/service/bolo-service' ) );
var BoloFixture = require( '../lib/bolo-entity-fixture' );


/* Test Specification */
describe('bolo service module', function () {
    var stubBoloRepository;
    var boloService;
    var attachments;

    before( function () {
        /* setup stubs */
        stubBoloRepository = {
            insert : function ( bolo, attachments ) {
                this.record = bolo;
                this.record.data.id = 'abc123';
                if ( attachments )
                    this.record.data.attachments = attachments;
                return Promise.resolve( this.record  );
            },
            getBolo : function ( id ) {
                var rec = ( id === this.record.data.id ) ? this.record : null;
                return Promise.resolve( rec );
            },
            update : function ( bolo, attachments ) {
                _.extend( this.record, bolo );
                if ( attachments ) {
                    _.extend( this.record.attachments, attachments );
                }
                return Promise.resolve( this.record );
            }
        };
    });

    beforeEach( function () {
        boloService = new BoloService( stubBoloRepository );

        attachments = {
            'an-image.jpg': {
                'content_type': 'image/jpeg',
                'path': 'some/path/on/fs'
            },
            'an-audio.mp3': {
                'content_type': 'audio/mp3',
                'path': 'some/path/on/fs'
            }
        };
    });

    afterEach( function () {
        stubBoloRepository.record = null;
    });

    describe( 'createBolo method', function () {
        var bolo;

        beforeEach( function () {
            bolo = BoloFixture.create();
        });

        it( 'saves valid BOLO data', function () {
            /* act */
            var promise = boloService.createBolo( bolo.data );

            /* assert */
            return promise
            .then( function ( newbolo ) {
                expect( newbolo.diff( bolo ) ).to.contain('id');
            });
        });

        it( 'inserts file attachments into the BOLO', function () {
            /* act */
            var promise = boloService.createBolo( bolo.data, attachments );

            /* assert */
            return promise
            .then( function ( response ) {
                expect( response.data.attachments ).to.include.all.keys(
                    ['an-image.jpg', 'an-audio.mp3']
                );
            });
        });
    }); /* end describe: createBolo method */

    describe( 'updateBolo method', function () {
        var originalBolo, updatedBolo;

        beforeEach( function () {
            originalBolo = BoloFixture.create();
            originalBolo.id = 'abc123';
            stubBoloRepository.record = originalBolo;

            updatedBolo = BoloFixture.copy( originalBolo.data );
        });

        it( 'saves valid bolo edits', function () {
            /* act */
            updatedBolo.data.hairColor = 'Red';
            var promise = boloService.updateBolo( updatedBolo.data );

            /* assert */
            return promise
                .then( function ( result ) {
                    expect( result ).to.not.equal( updatedBolo );
                    expect( result.data ).to.deep.equal( updatedBolo.data );
                });
        });

        it( 'adds new attachments to existing attachments', function () {
            /* arrange */
            originalBolo.attachments = {
                'some-image.jpg' : { 'content_type': 'image/jpeg' }
            };

            /* act */
            var promise = boloService.updateBolo( updatedBolo.data, attachments );

            /* assert */
            return promise
            .then( function ( response ) {
                expect( response.attachments ).to.include.all.keys(
                    ['some-image.jpg', 'an-image.jpg', 'an-audio.mp3']
                );
            });
        });
    }); /* end describe: updateBolo method */
});
