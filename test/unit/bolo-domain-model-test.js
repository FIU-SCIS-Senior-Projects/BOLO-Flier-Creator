/* jshint node: true, mocha: true, expr: true */
'use strict';

/*
 * Bolo Domain Model -- Unit Test
 *
 */


/* Dependencies */
var expect = require('chai').expect;
var path = require('path');


/* Base Project Paths */
var src_dir = path.resolve( __dirname, '../../src' );


/* Unit Under Test */
var Bolo = require( path.join( src_dir, 'core/domain/bolo.js' ) );


/* Test Specification */
describe('bolo entity', function () {
    var bolo;

    beforeEach( function () {
        bolo = new Bolo( { /* empty */ } );
    });

    it( '#isValid when validation passes', function () {
        expect( bolo.isValid() ).to.be.false;
    });

    it( '#attachImage file references', function () {
        /* arrange */
        var meta = { uuid: 'some-generated-uuid', filename: 'image.jpg' };

        /* act */
        bolo.attachImage( meta );

        /* assert */
        expect( bolo.data ).to.deep.contain.property( 'image[0]', meta );
    });

    it( '#attachVideo file references', function () {
        /* arrange */
        var meta = { uuid: 'some-generated-uuid', filename: 'video.mp4' };

        /* act */
        bolo.attachVideo( meta );

        /* assert */
        expect( bolo.data ).to.deep.contain.property( 'video[0]', meta );
    });

    it( '#attachAudio file references', function () {
        /* arrange */
        var meta  = { uuid: 'some-generated-uuid', filename: 'audio.mp3' };

        /* act */
        bolo.attachAudio( meta );

        /* assert */
        expect( bolo.data ).to.deep.contain.property( 'audio[0]', meta );
    });
});

