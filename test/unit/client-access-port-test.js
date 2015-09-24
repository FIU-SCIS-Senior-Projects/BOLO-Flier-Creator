/* jshint expr:true */
/* global describe, it */


/*
 * Client Access Port -- Unit Test
 *
 */


/* Testing Utilities */
var expect = require('chai').expect;
var sinon = require('sinon');
var path = require('path');


/* Base Project Paths */
var src_dir = path.join(__dirname, '../../src');


/* Unit Under Test */
var ClientAccess = require(path.join(src_dir, 'core/ports/client-access-port.js'));


/* Fixtures */
var date = new Date();
var validBoloData = {
    creationDate : date,
    lastUpdate : date,
    authorFName : "Jason",
    authorLName : "Cohen",
    authorUName : "jcohen",
    category : "ROBBERY",
    imageURL : [],
    videoLink : [],
    firstName : 'Barry',
    lastName : 'Badman',
    dob : "01-23-1945",
    dlNumber : 'D123-456-78-900-0',
    race : "Asian",
    sex : "M",
    height : "6-01",
    weight : "185",
    hairColor : "Black",
    tattoos : "Tomato tattoo on right chest",
    address : "123 Gangsta Lane",
    additional : "",
    summary : "",
    agency : "Pinecrest",
    archive : false
};


/* Test Specification */
describe('client access port', function () {

    it('should create a new BOLO and save it', function () {
        /* arrange */
        var clientAccess = new ClientAccess();
        var mockStorageAdapter = {
            'insert' : function ( data ) { this.record = data; }
        };

        /* act */
        clientAccess.createBolo( validBoloData, mockStorageAdapter );

        /* assert */
        expect( mockStorageAdapter.record ).to.deep.equal( validBoloData );
    });

});
