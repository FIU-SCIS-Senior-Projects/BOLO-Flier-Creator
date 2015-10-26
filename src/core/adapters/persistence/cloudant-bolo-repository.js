/* jshint node: true */
'use strict';

var _ = require('lodash');
var Promise = require('promise');

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

    bolo.id = bolo._id;
    delete bolo._id;
    delete bolo._rev;
    delete bolo.Type;

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
CloudantBoloRepository.prototype.insert = function ( bolo, attachments ) {
    if ( attachments ) {
        return insertBoloWithAttachments( bolo, attachments );
    } else {
        return insertBolo( bolo );
    }
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
    return db.get( id )
        .then( function ( bolo ) {
            return db.destroy( bolo._id, bolo._rev );
        })
        .catch( function ( error ) {
            new Error( 'Failed to delete BOLO: ' + error );
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
        .then( function ( result ) {
            var bolo = new Bolo( result );

            bolo.data.id = bolo.data._id;
            delete bolo.data._id;
            delete bolo.data._rev;

            return Promise.resolve( bolo );
        });
};



/*
 * Helper Methods
 */

function insertBolo ( bolo ) {
    var newbolo = new Bolo( bolo.data );
    newbolo.data.Type = DOCTYPE;

    return db.insert( newbolo.data )
        .then( function ( response ) {
            if ( !response.ok ) throw new Error( 'Unable to add BOLO' );

            delete newbolo.data.Type;
            newbolo.data.id = response.id;

            return Promise.resolve( newbolo );
        })
        .catch( function ( error ) {
            return Promise.reject( error );
        });
}

function insertBoloWithAttachments ( bolo, attachments ) {
    var newbolo = new Bolo( bolo.data );
    newbolo.data.Type = DOCTYPE;

    return db.insert( newbolo.data )
        .then ( function ( response ) {
            if ( !response.ok ) throw new Error( 'Unable to add BOLO' );

            delete newbolo.data.Type;
            newbolo.data.id = response.id;

            var promises = [];

            attachments.forEach( function ( att ) {
                promises.push( insertAttachment( response.id, att ) );
            });

            return Promise.all( promises );
        })
        .then( function () {
            return Promise.resolve( newbolo );
        })
        .catch( function ( error ) {
            return Promise.reject( error );
        });
}

function insertAttachment ( docname, attachment ) {
    attachment.data.on( 'end', function () {
        return Promise.resolve( true );
    });

    attachment.data.pipe(
        db.db.attachment.insert(
            docname,
            attachment.filename,
            null,
            attachment.content_type
        )
    );

    attachment.data.resume();
}

