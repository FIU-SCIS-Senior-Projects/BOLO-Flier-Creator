/* jshint node: true */
'use strict';

var _ = require('lodash');
var Promise = require('promise');

var db = require('../../lib/cloudant-promise').db.use('bolo');
var Bolo = require('../../domain/bolo.js');

var DOCTYPE = 'bolo';

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
    var tmpBolo = new Bolo( bolo.data );

    return db.get( tmpBolo.data.id )
        .then( function ( data ) {
            tmpBolo.data._rev = data._rev;
            tmpBolo.data._id = data._id;
            tmpBolo.data.Type = DOCTYPE;

            return db.insert( tmpBolo.data );
        })
        .then( function ( response ) {
            if ( !response.ok ) throw new Error( 'Unable to update BOLO' );

            delete tmpBolo.data._id;
            delete tmpBolo.data._rev;
            delete tmpBolo.data.Type;

            return Promise.resolve( tmpBolo );
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
                var bolo = new Bolo( item.doc );
                bolo.data.id = bolo.data._id;
                delete bolo.data._id;
                delete bolo.data._rev;
                return bolo;
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
