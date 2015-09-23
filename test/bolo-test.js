/*
 * Bolo Domain Model -- Unit Test
 *
 */

var expect = require('chai').expect;

var Bolo = require('../src/core/domain/bolo.js');

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

