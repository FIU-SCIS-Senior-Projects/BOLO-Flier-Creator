/* jshint node: true, mocha: true, expr:true */
'use strict';

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

    before( function () {
        /* setup stubs */
        stubBoloRepository = {
            insert : function ( boloDTO, attachments ) {
                this.record = boloDTO;
                this.record.data.id = 'abc123';
                if ( attachments )
                    this.record.data.attachments = attachments;
                return Promise.resolve( this.record  );
            },
            getBolo : function ( id ) {
                var rec = ( id === this.record.data.id ) ? this.record : null;
                return Promise.resolve( rec );
            },
            update : function ( bolo ) {
                this.record = bolo;
                return Promise.resolve( this.record );
            }
        };
    });

    beforeEach( function () {
        boloService = new BoloService( stubBoloRepository );
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
            /* arrange */
            var attachments = { 'new': {
                'an-image.jpg': {
                    'content_type': 'image/jpeg',
                    'path': 'some/path/on/fs'
                },
                'an-audio.mp3': {
                    'content_type': 'audio/mp3',
                    'path': 'some/path/on/fs'
                }
            } };

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
    });

    describe( 'updateBolo method', function () {
        it( 'saves valid bolo edits', function () {
            /* arrange */
            var originalBolo = BoloFixture.create();
            originalBolo.data.id = 'abc123';
            boloService.createBolo( originalBolo.data );

            var updatedBolo = BoloFixture.copy( originalBolo.data );

            /* act */
            updatedBolo.data.hairColor = 'Red';
            var promise = boloService.updateBolo( updatedBolo.data );

            /* assert */
            return promise
                .then( function ( result ) {
                    expect( result.diff( originalBolo ) ).to.contain( 'hairColor' );
                    expect( result.data.hairColor ).to.equal( 'Red' );
                });
        });
    });
});
