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
 * @returns {Bolo} - a bolo in the generic Bolo entity format
 * @private
 */
function boloFromCloudant( bolo_doc ) {
    var bolo = new Bolo( bolo_doc );

    bolo.data.id = bolo.data._id;
    delete bolo.data._id;
    delete bolo.data._rev;
    delete bolo.data.Type;

    if ( bolo.data._attachments ) {
        bolo.data.attachments = bolo.data._attachments;
        delete bolo.data._attachments;
    }

    return bolo;
}

/**
 * Transform the bolo to a format suitable for cloudant.
 *
 * @param {Bolo} - the bolo to transform
 * @returns {Object} - an object suitable for Cloudant
 * @private
 */
function boloToCloudant( bolo ) {
    var doc = _.assign( {}, bolo.data );

    doc.Type = DOCTYPE;
    doc._id = doc.id;
    delete doc.id;

    return doc;
}

/**
 * Transform an _attachments object from Cloudant into the format expected by
 * the Bolo object.
 */
function attachmentsFromCloudant ( attachments ) {
    return Object.keys( attachments ).map( function ( key ) {
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
function transformAttachment ( original ) {
    var readFile = Promise.denodeify( fs.readFile );

    var createDTO = function ( readBuffer ) {
        return {
            'name': original.name,
            'content_type': original.content_type,
            'data': readBuffer
        };
    };

    var readFileErrorHandler = function ( error ) {
        var msg = 'Failed to open attachment file path: ' + original.path;
        throw new Error( msg );
    };

    return readFile( original.path ).then( createDTO, readFileErrorHandler );
}

function createAgencyBoloID ( agencyName ) {
    var prefix = agencyName.toLowerCase().replace( /\s*/g, '' );
    var id = uuid.v4().replace( /-/g, '' );
    return prefix + '_' + id;
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
function CloudantBoloRepository () {
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
    var context = this;
    var atts = attachments || [];

    var newdoc = boloToCloudant( bolo );
    var docID = createAgencyBoloID( newdoc.agency );

    var handleBoloInsert = function ( attDTOs ) {
        if ( attDTOs.length ) {
            return db.insertMultipart( newdoc, attDTOs, docID );
        } else {
            newdoc._id = docID;
            return db.insert( newdoc );
        }
    };

    var handleInsertResponse = function ( response ) {
        if ( !response.ok ) handleInsertErrorResponse( response.reason );
        return context.getBolo( response.id );
    };

    var handleInsertErrorResponse= function ( error ) {
        return new Error(
            'Unable to create new document: ' + error.reason
        );
    };

    return Promise.all( atts.map( transformAttachment ) )
        .then( handleBoloInsert )
        .then( handleInsertResponse, handleInsertErrorResponse );
};


/**
 * Updata a BOLO in the BOLO respository
 *
 * @param {Bolo} - the bolo to update
 */
CloudantBoloRepository.prototype.update = function ( bolo ) {
    var newdoc = boloToCloudant( bolo );

    return db.get( bolo.data.id )
        .then( function ( doc ) {
            newdoc._rev = doc._rev;
            return db.insert( newdoc );
        })
        .then( function ( response ) {
            if ( !response.ok ) throw new Error( 'Unable to update BOLO' );
            return Promise.resolve( boloFromCloudant( newdoc ) );
        })
        .catch( function ( error ) {
            return Promise.reject( error );
        });
};


/**
 * Delete a bolo from the bolo repository.
 *
 * @param {String} - The id of the bolo to delete
 */
CloudantBoloRepository.prototype.delete = function ( id ) {
    // **UNDOCUMENTED BEHAVIOR**
    // cloudant/nano library destroys the database if a null/undefined argument
    // is passed into the `docname` argument for `db.destroy( docname,
    // callback)`. It seems that passing null to the object provided by
    // `db.use( dbname )` creates the equivalent database API requests, i.e.
    // create/read/delete database.
    if ( !id ) throw new Error( 'id cannot be null or undefined' );

    return db.get( id )
        .then( function ( bolo ) {
            return db.destroy( bolo._id, bolo._rev );
        })
        .catch( function ( error ) {
            return new Error(
                'Failed to delete BOLO: ' + error.error + ' / ' + error.reason
            );
        });
};

CloudantBoloRepository.prototype.getBolos = function () {
    return db.view( 'bolo', 'all_active', { include_docs: true } )
        .then( function ( result ) {
            var bolos = result.rows.map( function ( item ) {
                return boloFromCloudant( item.doc );
            });
            return Promise.resolve( bolos );
        });
};

CloudantBoloRepository.prototype.getBolo = function (id) {
    return db.get(id)
        .then( function ( bolo_doc ) {
            return boloFromCloudant( bolo_doc );
        });
};

