/* jshint node: true */
'use strict';
var _ = require('lodash');

var Agency = require('../domain/agency.js');
var Promise = require('promise');

/** @module core/ports */
module.exports = AgencyService;


/**
 * Creates a new instance of {AgencyService}.
 *
 * @class
 * @classdesc Provides an API for client adapters to interact with user facing
 * functionality.
 *
 * @param {AgencyRepository} 
 */
function AgencyService ( AgencyRepository ) {
    this.AgencyRepository = AgencyRepository;
}


/**
 * Create a new Agency in the system.
 *
 * @param {object} agencyData - Data for the new Agency
 * @param {object} attachments - Agency Attachments
 */
AgencyService.prototype.createAgency = function ( agencyData, attachments) {
    var agency = new Agency( agencyData );

    if ( !agency.isValid() ) {
        Promise.reject( new Error( "invalid agency data" ) );
    }

    return this.AgencyRepository.insert( agency, attachments)
        .then( function ( value ) {
            return value;
        })
        .catch( function ( error ) {
            throw new Error( 'Unable to create Agency.' );
        });
};

/**
 * Create a new Agency in the system.
 *
 * @param {object} agencyData - Agency to update
 * @param {object} attachments - Agency Attachments
 */
AgencyService.prototype.updateAgency = function ( agencyData, attachments ) {
    var context = this;
    var updated = new Agency( agencyData );

    if ( ! updated.isValid() ) {
        throw new Error( "Invalid agency data" );
    }

    return context.AgencyRepository.getAgency( updated.data.id )
    .then( function ( original ) {

        var atts = _.assign( {}, original.data.attachments );
        original.diff( updated ).forEach( function ( key ) {
            original.data[key] = updated.data[key];
        });

        original.data.attachments = atts;

        return context.AgencyRepository.update( original, attachments );
    })
    .then( function ( updated ) {
        return updated;
    })
    .catch( function ( error ) {
        return Promise.reject( { success: false, error: error.message } );
    });
};

/**
 * Retrieve a collection of agencies
 */
AgencyService.prototype.getAgencies = function ( ids ) {
    return this.AgencyRepository.getAgencies( ids );
};

AgencyService.prototype.getAgency = function ( id ) {
    var context = this;
    return context.AgencyRepository.getAgency( id );
};

/**
 * Get an attachment for a specified Agency.
 */
AgencyService.prototype.getAttachment = function ( id, attname ) {
    var context = this;
    return context.AgencyRepository.getAttachment( id, attname );
};

AgencyService.formatDTO = formatDTO;
AgencyService.prototype.formatDTO = formatDTO;
function formatDTO ( dto ) {
    var newdto = new Agency().data;

    Object.keys( newdto ).forEach( function ( key ) {
        newdto[key] = dto[key] || newdto[key];
    });

    return newdto;
}
