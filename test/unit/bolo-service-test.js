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
            insert : function ( boloDTO ) {
                this.record = boloDTO;
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
        it( 'saves valid BOLO data', function () {
            /* act */
            var bolo = BoloFixture.create();
            var promise = boloService.createBolo( bolo.data );

            /* assert */
            return promise
            .then( function ( result ) {
                expect( result ).to.deep.equal( bolo );
                expect( stubBoloRepository.record ).to.deep.equal( result );
            });
        });

        it.skip( 'inserts file attachments into the BOLO', function () {
            /* arrange */

            /* act */
            var promise = boloService
                .createBolo( validBoloData, fileAttachments );

            /* assert */
            return promise
                .then( function ( result ) {
                    expect( msa.record ).to.contain.key( 'image' );
                    expect( msa.record.image[0] ).to.contain.deep.property(
                        'filename', path.basename( fa.image[0] )
                    );
                });
        });
    });
});
