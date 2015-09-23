/* jshint expr:true */
/* global describe, it */

var expect = require('chai').expect;

var ClientAccess = require('../../src/core/ports/client-access-port.js');
var StorageMock = require('../../src/core/adapters/mock-storage-adapter.js');

describe('Officer creates a BOLO', function () {

    it('should submit with sufficient information', function () {
        var clientAccess = new ClientAccess();
        var storageAdapter = new StorageMock();
        var date = new Date();

        // given the BOLO has sufficient information
        var formData = {
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

        // when the Officer submits the BOLO to be saved
        var response = clientAccess.createBolo(formData, storageAdapter);

        // then the system will return a success message
        expect(response.success).to.be.true;
    });

});