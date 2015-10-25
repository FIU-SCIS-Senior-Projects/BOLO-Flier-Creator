/* jshint node: true */
'use strict';

var cloudant = require('../../lib/cloudant-connection.js');
var _ = require('lodash');
var Bolo = require('../../domain/bolo.js');
var db = cloudant.db.use('bolo');
var Promise = require('promise');

module.exports = CloudantBoloRepository;


/**
 * Create a new CloudantBoloRepository object.
 *
 * @class
 * @memberof module:core/adapters
 * @classdesc Implements the interface for a Storage Port to expose operations
 * which interact with th Cloudant Database service.
 */
function CloudantBoloRepository () {
    // constructor stub
}


/**
 * Insert data on the Cloudant Database
 *
 * @param {Object} - Data to store
 */
CloudantBoloRepository.prototype.insert = function ( data ) {
    db.insert(data, function (err, body) {
        if (err) console.log("cloudant-storage-adapter error: " + err);
    });
};

CloudantBoloRepository.prototype.getBolos = function () {
    return new Promise(function (fulfill, reject) {
        db.list({
            include_docs: true
        }, function (err, body) {
            if (err) {
                reject(err);
            } else {
                fulfill(body.rows);
            }
        });
    });

};

CloudantBoloRepository.prototype.getBolo = function (id) {
    return new Promise(function (fulfill, reject) {
        db.get(id, function (err, body) {
            if (err) {
                reject(err);
            } else {
                var bolo = new Bolo();
                fulfill(_.defaultsDeep(bolo, body));
            }
        });
    });
};

CloudantBoloRepository.prototype.delete = function ( id ) {
    return this.getBolo( id )
        .then( function ( body ) {
            db.destroy(body._id, body._rev, function (err, body) {
                if (err) {
                    Promise.reject( err );
                } else {
                    Promise.resolve( body.ok );
                }
            });
        });
};