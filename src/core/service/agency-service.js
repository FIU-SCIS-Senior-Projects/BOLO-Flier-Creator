/* jshint node: true */
'use strict';

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