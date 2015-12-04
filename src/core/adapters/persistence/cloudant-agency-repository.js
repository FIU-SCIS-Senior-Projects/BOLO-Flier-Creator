/* jshint node: true */
'use strict';

var _ = require('lodash');
var fs = require('fs');
var Promise = require('promise');
var uuid = require('node-uuid');
var path = require('path');

var db = require('../../lib/cloudant-promise').db.use('bolo');
var Agency = require('../../domain/agency.js');

var DOCTYPE = 'agency';


module.exports = CloudantAgencyRepository;


/**
 * Transform the agency doc to a suitable format for the Agency entity object.
 *
 * @param {Object} - the doc to transform to an agency
 * @returns {Agency} - an agency in the generic Agency entity format
 * @private
 */
function agencyFromCloudant(agency_doc) {
    var agency = new Agency(agency_doc);

    agency.data.id = agency.data._id;
    delete agency.data._id;
    delete agency.data._rev;
    delete agency.data.Type;

    if (agency.data._attachments) {
        agency.data.attachments = agency.data._attachments;
        delete agency.data._attachments;
    }

    return agency;
}

/**
 * Transform the agency to a format suitable for cloudant.
 *
 * @param {Agency} - the agency to transform
 * @returns {Object} - an object suitable for Cloudant
 * @private
 */
function agencyToCloudant(agency) {
    var doc = _.assign({}, agency.data);

    doc.Type = DOCTYPE;

    if ( doc.id ) {
        doc._id = doc.id;
        delete doc.id;
    }

    if ( agency.data.attachments ) {
        doc._attachments = _.assign( {}, agency.data.attachments );
        delete doc.attachments;
    }

    return doc;
}


function createAgencyID() {
    var id = uuid.v4().replace(/-/g, '');
    return id;
}

/**
 * Transform attachment DTOs to the Cloudant attachment DTO fomat
 *
 * @param {Object} - an attachment DTO
 * @returns {Promise|Object} - Promise resolving to the transformed DTO
 * @private
 */
function transformAttachment(original) {
    var readFile = Promise.denodeify(fs.readFile);

    var createDTO = function (readBuffer) {
        return {
            'name': original.name,
            'content_type': original.content_type,
            'data': readBuffer
        };
    };

    var errorHandler = function (error) {
        throw new Error('transformAttachment: ', error);
    };

    return readFile(original.path)
        .then(createDTO)
        .catch(errorHandler);
}


/**
 * Create a new CloudantAgencyRepository object.
 *
 */
function CloudantAgencyRepository() {
    // constructor stub
}

/**
 * Insert an agency document in the Cloudant Database
 *
 * @param {Object} - agency to store
 * @param {Object} - attachments of the agency
 */
CloudantAgencyRepository.prototype.insert = function (agency, attachments) {
    var context = this;
    var atts = attachments || [];

    var newdoc = agencyToCloudant(agency);
    newdoc._id = createAgencyID();

    return Promise.all(atts.map(transformAttachment))
        .then(function (attDTOs) {
            if (attDTOs.length) {
                return db.insertMultipart(newdoc, attDTOs, newdoc._id);
            } else {
                return db.insert(newdoc, newdoc._id);
            }
        })
        .then(function (response) {
            if (!response.ok) throw new Error(response.reason);
            return context.getAgency(response.id);
        })
        .catch(function (error) {
            throw new Error(
                'Unable to create new document: ' + error.reason
                );
        });
};

/**
 * Updates an agency
 *
 * @param {Agency} - the agency to update
 * @param {Attachments} - the attachments belonging to that agency
 */
CloudantAgencyRepository.prototype.update = function ( agency, attachments ) {
    var agencyToUpdate = agencyToCloudant( agency );
    var atts = attachments || [];

    var currentAgencyRev = db.get( agency.data.id );
    var attsPromise = Promise.all( atts.map( transformAttachment ) );

    return Promise.all([ currentAgencyRev, attsPromise ])
        .then( function ( data ) {
            var doc = data[0],
                attDTOs = data[1];

            agencyToUpdate._rev = doc._rev;
            agencyToUpdate._attachments = doc._attachments || {};

            if ( attDTOs.length ) {
                return db.insertMultipart( agencyToUpdate, attDTOs, agencyToUpdate._id );
            } else {
                return db.insert( agencyToUpdate );
            }
        })
        .then( function ( response ) {
            if ( !response.ok ) throw new Error( 'Unable to update AGENCY' );
            return Promise.resolve( agencyFromCloudant( agencyToUpdate ) );
        })
        .catch( function ( error ) {
            return Promise.reject( error );
        });
};

/**
 * Retrieve an agency document from the Cloudant Database
 *
 * @param {int} - agency id
 */
CloudantAgencyRepository.prototype.getAgency = function (id) {
    return db.get(id)
        .then(function (agency_doc) {
            return agencyFromCloudant(agency_doc);
        });
};

/**
 * Retrieve a collection of agencies from the cloudant database
 */
CloudantAgencyRepository.prototype.getAgencies = function ( ids ) {
    var opts = { 'include_docs': true, };

    if ( _.isArray( ids ) ) opts.keys = ids;

    return db.view( 'agency', 'all_active', opts ).then( function ( result ) {
        var agencies = result.rows.map( function ( row ) {
            return agencyFromCloudant( row.doc );
        });
        return agencies;
    });
};

CloudantAgencyRepository.prototype.getAttachment = function ( id, attname ) {
    var bufferPromise = db.getAttachment( id, attname );
    var docPromise = db.get( id );

    return Promise.all([ bufferPromise, docPromise ])
    .then( function ( data ) {
        var buffer = data[0];
        var attinfo = data[1]._attachments[attname];

        return {
            'name': attname,
            'content_type': attinfo.content_type,
            'data': buffer
        };
    });
};

CloudantAgencyRepository.prototype.delete = function ( id ) {
    // **UNDOCUMENTED BEHAVIOR**
    // cloudant/nano library destroys the database if a null/undefined argument
    // is passed into the `docname` argument for `db.destroy( docname,
    // callback)`. It seems that passing null to the object provided by
    // `db.use( dbname )` creates the equivalent database API requests, i.e.
    // create/read/delete database.
    if ( !id ) throw new Error( 'id cannot be null or undefined' );

    return db.get( id ).then( function ( doc ) {
        return db.destroy( doc._id, doc._rev );
    })
    .catch( function ( error ) {
        return new Error(
            'Failed to delete BOLO: ' + error.error + ' / ' + error.reason
        );
    });
};