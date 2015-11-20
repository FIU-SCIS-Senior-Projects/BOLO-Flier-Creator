/* jshint node: true */
'use strict';

var _ = require('lodash');
var fs = require('fs');
var Jimp = require('jimp');
var Promise = require('promise');
var uuid = require('node-uuid');

var db = require('../../lib/cloudant-promise').db.use('bolo');
var Agency = require('../../domain/agency.js');

var DOCTYPE = 'agency';

module.exports = CloudantAgencyRepository;

/**
 * Create a new CloudantAgencyRepository object.
 *
 */
function CloudantAgencyRepository() {
    // constructor stub
}

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

    doc._id = doc.id;

    delete doc.id;

    if (agency.data.attachments) {
        doc._attachments = _.assign({}, agency.data.attachments);
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
 * Retrieve an agency document from the Cloudant Database
 *
 * @param {int} - agency id
 */
CloudantAgencyRepository.prototype.getAgency = function (id) {
    return db.get(id)
        .then(function (agency_doc) {
            console.log(agency_doc);
            return agencyFromCloudant(agency_doc);
        });
};