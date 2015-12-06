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
BoloService.prototype.createBolo = function ( boloDTO, attachments ) {
    var bolo = new Bolo( boloDTO );

    if ( ! bolo.isValid() ) {
        Promise.reject( new Error( "Invalid bolo data" ) );
    }

    return this.boloRepository.insert( bolo, attachments )
    .catch( function ( error ) {
        throw new Error( 'Unable to create BOLO.' );
    });
};

/**
 * Update BOLO data.
 *
 * @param {Object} - bolo update data (should include id)
 * @param {Object|Array} - Array of attachment objects.
 * @returns {Promise|Bolo} the updated Bolo object
 */
BoloService.prototype.updateBolo = function ( updateDTO, attachments ) {
    var context = this;
    var bolo = new Bolo( updateDTO );

    return this.boloRepository.update( bolo, attachments )
    .catch( function ( error ) {
        throw new Error( 'Unable to update BOLO.' );
    });
};

BoloService.prototype.getBolo = function (id) {
    var context = this;
    return context.boloRepository.getBolo(id);
};

/**
 * Retrieve a collection of bolos
 */
BoloService.prototype.getBolos = function ( limit, skip ) {
    return this.boloRepository.getBolos( limit, skip );
};

BoloService.prototype.getArchiveBolos = function ( limit, skip ) {
    return this.boloRepository.getArchiveBolos( limit, skip );
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

BoloService.formatDTO = formatDTO;
BoloService.prototype.formatDTO = formatDTO;
function formatDTO ( dto ) {
    var newdto = new Bolo().data;

    Object.keys( newdto ).forEach( function ( key ) {
        newdto[key] = dto[key] || newdto[key];
    });

    return newdto;
}

