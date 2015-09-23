/* jshint expr:true */
/* global describe, it */


/* Testing Utilities */
var expect = require('chai').expect;
var sinon = require('sinon');


/* Unit Under Test */
var ClientAccess = require('../src/core/ports/client-access-port.js');


/* Test Fixtures */
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


/* Test Suite */
describe('client access port', function () {

    it('should create a new BOLO and save it', function () {
        /* arrange */
        var clientAccess = new ClientAccess();
        var mockStorageAdapter = {
            'record' : {},
            'insert' : function ( data ) { this.record = data; }
        };

        /* act */
        clientAccess.createBolo( validBoloData, mockStorageAdapter );

        /* assert */
        expect( mockStorageAdapter.record ).to.deep.equal( validBoloData );
    });

});
