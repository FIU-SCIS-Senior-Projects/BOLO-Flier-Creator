/*
 * Cloudant Storage Adapter
 *
 * Implements required interface for a Bolo Domain Storage Port for the
 * Cloudant Database.
 */

var cloudant = require('../../lib/cloudant-connection.js');
var _ = require('lodash-node');
var Bolo = require('../../domain/bolo.js');

var adapter = function () {};
var db = cloudant.db.use('bolo');


adapter.prototype.insert = function (data) {
    db.insert(data, function (err, body) {
        if (err) console.log("cloudant-storage-adapter error: " + err);
    });
};

adapter.prototype.getBolos = function (callback) {
    db.list({include_docs: true},function (err, body) {
        if (err) {
            console.log("cloudant-storage-adapter error: " + err)
        }
        else
        {
            callback(body.rows);
        }
    });
};

adapter.prototype.getBolo = function (id, callback) {
    db.get( id,function (err, body) {
        if (err) {
            console.log("cloudant-storage-adapter error: " + err)
        }
        else
        {
            bolo = new Bolo();
            callback( _.defaultsDeep(bolo, body));
        }
    });
};

module.exports = adapter;