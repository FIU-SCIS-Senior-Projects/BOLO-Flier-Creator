/* jshint node: true */
'use strict';

/*
 * Client Access Port
 *
 * This port provides an API for client adapters to interact with user facing
 * functionality.
 *
 */

/* Dependencies */
var Bolo = require('../domain/bolo.js');
var Promise = require('promise');


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


/*
 * Client Port Interface
 * @constructor
 * @param storageAdapter - A storage adapter implementing the Storage Port
 *                         Interface.
 */
function ClientPort ( storageAdapter, mediaAdapter ) {
    this.storageAdapter = storageAdapter;
    this.mediaAdapter = mediaAdapter;
}

/**
 * Create a new BOLO in the system.
 *
 * @param {object} boloData - Data for the new BOLO
 * @param {object} attachments - BOLO Attachments
 *                               valid keys = { image, video, audio }
 */
ClientPort.prototype.createBolo = function ( boloData, attachments ) {
    var bolo = new Bolo( boloData );
    var promise;
    var that = this;

    promise = processAttachments( attachments, bolo, this.mediaAdapter );

    return promise
        .then( function ( value ) {
            // TODO Include a reason why its invalid ( wrong field? )
            if ( ! bolo.isValid() ) throw new Error( "invalid bolo data" );
            return that.storageAdapter.insert( bolo.data );
        })
        .then( function ( value ) {
            return { success: true };
        })
        .catch( function ( error ) {
            return { success: false, error: error.message };
        });
};

module.exports = ClientPort;
