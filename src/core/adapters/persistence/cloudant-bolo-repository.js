/* jshint node: true */
'use strict';

var _ = require('lodash');
var fs = require('fs');
var Promise = require('promise');
var uuid = require('node-uuid');

var db = require('../../lib/cloudant-promise').db.use('bolo');
var Bolo = require('../../domain/bolo.js');
var DOCTYPE = 'bolo';

/**
 * Transform the bolo doc to a suitable format for the Bolo entity object.
 *
 * @param {Object} - the doc to transform to a bolo
 * @returns {Bolo} a bolo in the generic Bolo entity format
 * @private
 */
function boloFromCloudant(bolo_doc) {
    var bolo = new Bolo(bolo_doc);

    bolo.data.id = bolo.data._id;
    delete bolo.data._id;
    delete bolo.data._rev;
    delete bolo.data.Type;

    if (bolo.data._attachments) {
        bolo.data.attachments = bolo.data._attachments;
        delete bolo.data._attachments;
    }

    return bolo;
}

/**
 * Transform the bolo to a format suitable for cloudant.
 *
 * @param {Bolo} - the bolo to transform
 * @returns {Object} an object suitable for Cloudant
 * @private
 */
function boloToCloudant(bolo) {
    var doc = _.assign({}, bolo.data);

    doc.Type = DOCTYPE;

    if ( doc.id ) {
        doc._id = doc.id;
        delete doc.id;
    }

    if (bolo.data.attachments) {
        doc._attachments = _.assign({}, bolo.data.attachments);
        delete doc.attachments;
    }

    return doc;
}

/**
 * Transform an _attachments object from Cloudant into the format expected by
 * the Bolo object.
 */
function attachmentsFromCloudant(attachments) {
    return Object.keys(attachments).map(function (key) {
        return {
            'name': key,
            'content_type': attachments[key].content_type
        };
    });
}

/**
 * Transform attachment DTOs to the Cloudant attachment DTO fomat
 *
 * @param {Object} - an attachment DTO
 * @returns {Promise|Object} - Promise resolving to the transformed DTO
 * @private
 */
function attachmentsToCloudant( dto ) {
    var readFile = Promise.denodeify( fs.readFile );

    if ( ! dto ) return null;

    return readFile( dto.path ).then( function ( buffer ) {
        return {
            'name': dto.name,
            'content_type': dto.content_type,
            'data': buffer
        };
    }).catch( function ( error ) {
        throw new Error( 'attachmentsToCloudant: ', error );
    });
}

function createUUID () {
    return uuid.v4().replace(/-/g, '');
}


module.exports = CloudantBoloRepository;


/**
 * Create a new CloudantBoloRepository object.
 *
 * @class
 * @memberof module:core/adapters
 * @classdesc Implements the interface for a Storage Port to expose operations
 * which interact with th Cloudant Database service.
 */
function CloudantBoloRepository() {
    // constructor stub
}


/**
 * Insert data on the Cloudant Database
 *
 * @param {Object} - Data to store
 * @param {Array|Object} - Optional array of attachment DTOs containing the
 * 'name', 'content_type', and 'path' keys.
 */
CloudantBoloRepository.prototype.insert = function ( bolo, attachments ) {
    var newdoc = boloToCloudant( bolo );
    newdoc._id = createUUID();

    var atts = _.map( attachments, attachmentsToCloudant );

    return Promise.all( atts ).then( function ( attDTOs ) {
        if ( attDTOs.length ) {
            return db.insertMultipart(newdoc, attDTOs, newdoc._id);
        } else {
            return db.insert(newdoc, newdoc._id);
        }
    }).then( function ( response ) {
        if ( !response.ok ) throw new Error( response.resaon );
        return boloFromCloudant( newdoc );
    }).catch( function ( error ) {
        throw new Error( 'Unable to create new document: ' + error.message );
    });
};


/**
 * Update a BOLO in the BOLO respository
 *
 * @param {Bolo} - the bolo to update
 */
CloudantBoloRepository.prototype.update = function ( bolo, attachments ) {
    var context = this;
    var newdoc = boloToCloudant( bolo );

    var atts = _.map( attachments, attachmentsToCloudant );
    var preWorkPromises = [ db.get( newdoc._id ), Promise.all( atts )];

    return Promise.all( preWorkPromises ).then( function ( prereqs ) {
        var doc     = prereqs[0],
            attDTOs = prereqs[1];

        var blacklist = [
            'isActive', 'Type', '_id', '_attachments', 'createdOn', 'agency',
            'author', 'authorFname', 'authorLName', 'authorUName', 'images'
        ];

        _( newdoc ).omit( blacklist ).each( function ( val, key ) {
            doc[key] = val;
        }).run();

        if ( newdoc.images_deleted ) {
            doc._attachments = _.omit( doc._attachments, newdoc.images_deleted );
            doc.images = _.omit( doc.images, newdoc.images_deleted );
        }

        if ( attDTOs.length ) {
            _.extend( doc.images, newdoc.images );
            return db.insertMultipart( doc, attDTOs, newdoc._id );
        } else {
            return db.insert( doc );
        }
    }).then(function ( response ) {
        if ( !response.ok ) throw new Error( 'Unable to update BOLO' );
        return context.getBolo( response.id );
    }).catch(function ( error ) {
        throw new Error( 'Unable to update bolo doc: ' + error.message );
    });
};


/**
 * Inactivate a bolo from the bolo repository.
 *
 * @param {String} - The id of the bolo to inactivate
 */
CloudantBoloRepository.prototype.activate = function (id, activate) {

    return db.get(id)
        .then(function (bolo) {
            bolo.isActive = activate;
            return db.insert(bolo);
        })
        .catch(function (error) {
            return new Error(
                'Failed to activate/inactivate BOLO: ' + error.error + ' / ' + error.reason
                );
        });
};


CloudantBoloRepository.prototype.delete = function (id) {
    // **UNDOCUMENTED BEHAVIOR**
    // cloudant/nano library destroys the database if a null/undefined argument
    // is passed into the `docname` argument for `db.destroy( docname,
    // callback)`. It seems that passing null to the object provided by
    // `db.use( dbname )` creates the equivalent database API requests, i.e.
    // create/read/delete database.
    if (!id) throw new Error('id cannot be null or undefined');

    return db.get(id)
        .then(function (bolo) {
            return db.destroy(bolo._id, bolo._rev);
        })
        .catch(function (error) {
            return new Error(
                'Failed to delete BOLO: ' + error.error + ' / ' + error.reason
                );
        });
};


CloudantBoloRepository.prototype.getBolos = function ( limit, skip ) {
    var opts = {
        'include_docs': true,
        'limit': limit,
        'skip': skip,
        'descending': true
    };

    return db.view( 'bolo', 'all_active', opts ).then( function ( result ) {
        var bolos = _.map( result.rows, function ( row ) {
            return boloFromCloudant( row.doc );
        });
        return { 'bolos': bolos, total: result.total_rows };
    });
};


CloudantBoloRepository.prototype.getArchiveBolos = function ( limit, skip ) {
    var opts = {
        'include_docs': true,
        'limit': limit,
        'skip': skip,
        'descending': true
    };

    return db.view( 'bolo', 'all_archive', opts ).then( function ( result ) {
        var bolos = _.map( result.rows, function ( row ) {
            return boloFromCloudant( row.doc );
        });
        return { bolos: bolos, total: result.total_rows };
    });
};


CloudantBoloRepository.prototype.getBolo = function (id) {
    return db.get(id)
        .then(function (bolo_doc) {
            return boloFromCloudant(bolo_doc);
        });
};


CloudantBoloRepository.prototype.getAttachment = function (id, attname) {
    var bufferPromise = db.getAttachment(id, attname);
    var docPromise = db.get(id);

    return Promise.all([bufferPromise, docPromise])
        .then(function (data) {
            var buffer = data[0];
            var attinfo = data[1]._attachments[attname];

            return {
                'name': attname,
                'content_type': attinfo.content_type,
                'data': buffer
            };
        });
};