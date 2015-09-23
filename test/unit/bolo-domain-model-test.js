/* jshint expr:true */
/* global describe, it */


/*
 * Bolo Domain Model -- Unit Test
 *
 */


/* Dependencies */
var expect = require('chai').expect;
var path = require('path');


/* Base Project Paths */
var src_dir = path.normalize(__dirname + '../../../src');


/* Unit Under Test */
var Bolo = require(path.join(src_dir, 'core/domain/bolo.js'));


/* Test Specification */
describe('bolo domain model', function () {

    it('should save data to a storage adapter', function () {
        var bolo = new Bolo( { "data": "bolo data" } );
        var mockStorage = {
            insert: function ( data ) {
                this._data = data;
            }
        };
        bolo.save( mockStorage );
        expect( mockStorage._data.data ).to.equal( "bolo data" );
    });

});

