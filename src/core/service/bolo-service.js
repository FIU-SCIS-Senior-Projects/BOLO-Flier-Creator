/* jshint node: true */
'use strict';

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
function BoloService ( boloRepository, mediaAdapter ) {
    this.boloRepository = boloRepository;
    this.mediaAdapter = mediaAdapter;
}


/**
 * Create a new BOLO in the system.
 *
 * @param {object} boloData - Data for the new BOLO
 * @param {object} attachments - BOLO Attachments
 *                               valid keys = { image, video, audio }
 */
BoloService.prototype.createBolo = function ( boloData, attachments ) {
    var bolo = new Bolo( boloData );
    var promise;
    var context = this;

    promise = processAttachments( attachments, bolo, this.mediaAdapter );

    return promise
        .then( function ( value ) {
            // TODO Include a reason why its invalid ( wrong field? )
            if ( ! bolo.isValid() ) throw new Error( "invalid bolo data" );
            return context.boloRepository.insert( bolo.data );
        })
        .then( function ( value ) {
            return Promise.resolve( { success: true } );
        })
        .catch( function ( error ) {
            return Promise.resolve( { success: false, error: error.message } );
        });
};

/**
 * Retrieve a collection of bolos
 */
BoloService.prototype.getBolos = function () {
    var ctx = this;
    return ctx.boloRepository.getBolos();
};

BoloService.prototype.getBolo = function (id) {
    var ctx = this;
    return ctx.boloRepository.getBolo(id);
};

BoloService.prototype.removeBolo = function ( id ) {
    return this.boloRepository.delete( id );
};


/*
 * Helper / Utility Methods
 */

/**
 * Process attachments using the supplied mediaAdapter. Meta received from the
 * mediaAdapter attached to the supplied bolo.
 *
 * @private
 * @param {Object} - object with file type as keys and file paths array as value
 * @param {Bolo} - the bolo to attach meta information to
 * @param {MediaAdapter} - media adapter to store to
 */
function processAttachments( attachments, bolo, mediaAdapter ) {
    var at = attachments || { image : [], video: [], audio: [] };
    var putImages, putVideos, putAudio;

    putImages = mediaAdapter
        .put( at.image )
        .then( function ( value ) {
            return bolo.attachImage( value );
        });

    putVideos = mediaAdapter
        .put( at.video )
        .then( function ( value ) {
            return bolo.attachVideo( value );
        });

    putAudio = mediaAdapter
        .put( at.audio )
        .then( function ( value ) {
            return bolo.attachAudio( value );
        });

    return Promise.all( [ putImages, putVideos, putAudio ] );
}
