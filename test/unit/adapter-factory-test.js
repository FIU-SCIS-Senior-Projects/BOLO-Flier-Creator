/* jshint expr:true */
/* global describe, it, before */


/*
 * Adapter Factory -- Unit Test
 *
 */


/* Dependencies */
var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');
var path = require('path');


/* Base Project Paths */
var src_dir = path.normalize(__dirname + '../../../src');


/* Unit Under Test */
var test_unit_path = path.join( src_dir, 'core/adapters' );


/* Test Specification */
describe('adapter factory', function () {
    var factory;
    var fsMock;
    var mockAdapter;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        // mock objects
        fsMock = { readdirSync: sinon.stub() };
        mockAdapter = function () {};

        // register need mocks
        mockery.registerMock( 'fs', fsMock );
        mockery.registerMock(
            path.join( src_dir, 'core/adapters/storage/file' ),
            mockAdapter
        );

        // load module under test
        factory = require( test_unit_path );
    });

    after(function () {
        mockery.disable();
    });

    describe('create method', function () {
        it('returns a new object when the requested adapter exists', function () {
            // arrange
            var fileAdapter;

            // act
            fileAdapter = factory.create( 'storage', 'file' );

            // assert
            expect(fileAdapter).to.be.instanceOf( mockAdapter );
        });

        it.skip('throws an error for invalid adapters', function () {
            expect( factory.create.bind( factory, 'storage', 'abc' ) ).to.throw(
                /Adapter does not exist/
            );
        });
    });


    it('lists valid adapters if the port exists', function () {
        // arrange
        var theList, fakeList = [ 'adapter1.js', 'adapter2.js' ];
        fsMock.readdirSync.returns( fakeList );

        // act
        theList = factory.list( 'storage' );

        // assert
        expect( theList ).to.equal( fakeList );

        // cleanup
        mockery.deregisterMock( 'fs' );
    });

});

