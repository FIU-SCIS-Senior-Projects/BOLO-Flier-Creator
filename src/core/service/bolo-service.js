/* jshint node: true */
'use strict';

var _ = require('lodash');
var Bolo = require('../domain/bolo.js');
var Promise = require('promise');


/** @module core/ports */
module.exports = BoloService;


/**
 * Creates a new instance of {BoloService}.
 *
 * @class
 * @classdesc Provides an API for client adapters to interact with user facing
 * functionality.
 *
 * @param {BoloRepository} - Object implementing the Storage Port Interface.
 * @param {MediaAdapter} - Object implementing the Media Port Interface.
 */
function BoloService ( boloRepository ) {
    this.boloRepository = boloRepository;
}


/**
 * Create a new BOLO in the system.
 *
 * @param {object} boloData - Data for the new BOLO
 * @param {object} attachments - BOLO Attachments
 */
BoloService.prototype.createBolo = function ( boloData, attachments ) {
    var bolo = new Bolo( boloData );

    if ( ! bolo.isValid() ) {
        Promise.reject( new Error( "invalid bolo data" ) );
    }

    return this.boloRepository.insert( bolo, attachments )
        .then( function ( value ) {
            return value;
        })
        .catch( function ( error ) {
            throw new Error( 'Unable to create BOLO.' );
        });
};

BoloService.prototype.updateBolo = function ( boloData, attachments ) {
    var context = this;
    var updated = new Bolo( boloData );

    if ( ! updated.isValid() ) {
        throw new Error( "invalid bolo data" );
    }

    return context.boloRepository.getBolo( updated.data.id )
    .then( function ( original ) {
        var atts = _.assign( {}, original.data.attachments );

        original.diff( updated ).forEach( function ( key ) {
            original.data[key] = updated.data[key];
        });

        original.data.attachments = atts;

        return context.boloRepository.update( original, attachments );
    })
    .then( function ( updated ) {
        return updated;
    })
    .catch( function ( error ) {
        return Promise.reject( { success: false, error: error.message } );
    });
};

/**
 * Retrieve a collection of bolos
 */
BoloService.prototype.getBolos = function (limit, skip) {
    var context = this;
    return context.boloRepository.getBolos(limit, skip);
};

BoloService.prototype.getBolo = function (id) {
    var context = this;
    return context.boloRepository.getBolo(id);
};

BoloService.prototype.getArchiveBolos = function ( ) {
    return this.boloRepository.getArchiveBolos( );
};

BoloService.prototype.activate = function ( id, activate ) {
    return this.boloRepository.activate( id, activate );
};

BoloService.prototype.removeBolo = function ( id ) {
    return this.boloRepository.delete( id );
};



/**
 * Get an attachment for a specified Bolo.
 *
 * @param {String} - the id of the bolo
 * @param {String} - the name of the attachment to get
 * @returns {Object} - a DTO containing the `name` and `content_type` of the
 * attachment and also the raw `data` as a {Buffer}
 */
BoloService.prototype.getAttachment = function ( id, attname ) {
    return this.boloRepository.getAttachment( id, attname );
};
