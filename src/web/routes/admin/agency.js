/* jshint node: true */
'use strict';

var _                   = require('lodash');
var multiparty          = require('multiparty');
var Promise             = require('promise');

var config              = require('../../config');
var agencyRepository    = new config.AgencyRepository();
var agencyService       = new config.AgencyService( agencyRepository );

var formUtil            = require('../../lib/form-util');

var GFERR               = config.const.GFERR;
var GFMSG               = config.const.GFMSG;

var parseFormData       = formUtil.parseFormData;
var cleanTemporaryFiles = formUtil.cleanTempFiles;

/**
 * Custom handling of agency attachments. Agencies should only have two
 * attachments. One for the logo and one for the shield.
 */
function getAgencyAttachments ( fields ) {
    var result = [];
    var fileDTO;

    if ( fields.logo_upload ) {
        fileDTO = _.assign( {}, fields.logo_upload );
        fileDTO.name = 'logo';
        result.push( fileDTO );
    }

    if ( fields.shield_upload ) {
        fileDTO = _.assign( {}, fields.shield_upload );
        fileDTO.name = 'shield';
        result.push( fileDTO );
    }

    return ( result.length ) ? result : null;
}


/**
 * Respond with a list
 */
module.exports.getList = function ( req, res ) {
    agencyService.getAgencies()
    .then(function (agencies) {
        res.render('agency-list', {
            agencies: agencies
        });
    });
};


/**
 * Respond with a form to create an agency.
 */
module.exports.getCreateForm = function (req, res) {
    res.render('agency-create-form');
};


/**
 * Process a form to create an agency.
 */
module.exports.postCreateForm = function ( req, res ) {
    parseFormData( req ).then( function ( formDTO ) {
        var agencyDTO = agencyService.formatDTO( formDTO.fields );
        var atts = getAgencyAttachments( formDTO.fields );
        var result = agencyService.createAgency( agencyDTO, atts );
        return Promise.all( [ result, formDTO ] );
    })
    .then(function (pData) {
        if (pData[1].files.length) cleanTemporaryFiles(pData[1].files);
        res.redirect('/admin/agency');
    })
    .catch( function ( error ) {
        console.error( 'Error occurred at %s >>> %s', req.originalUrl, error.message );
        req.flash( GFERR, 'Internal server occurred while processing your request, please try again.' );
        res.redirect( 'back' );
    });
};


/**
 * Respond with a form to edit agency details
 */
module.exports.getEditForm = function ( req, res ) {
    agencyService.getAgency(req.params.id)
    .then(function (agency) {
        res.render('agency-create-form', {
            agency: agency
        });
    })
    .catch(function (error) {
        console.error( error );
        res.redirect( 'back' );
    });
};


/**
 * Process a form to edit/update agency details.
 */
module.exports.postEditForm = function ( req, res ) {
    parseFormData( req ).then( function ( formDTO ) {
        var agencyDTO = agencyService.formatDTO( formDTO.fields );
        var atts = getAgencyAttachments( formDTO.fields );
        var result = agencyService.updateAgency( agencyDTO, atts );
        return Promise.all([ result, formDTO ]);
    })
    .then( function ( pData ) {
        if ( pData[1].files.length ) cleanTemporaryFiles( pData[1].files );
        res.redirect( '/admin/agency' );
    })
    .catch( function ( err ) {
        console.error( 'Error occurred at %s >>> %s', req.originalUrl, err.message );
        req.flash( GFERR, 'Internal server occurred while processing your request, please try again.' );
        res.redirect( 'back' );
    });
};


/**
 * Get an attachment associated with the agency id.
 */
module.exports.getAttachment = function ( req, res ) {
    agencyService.getAttachment( req.params.id , req.params.attname )
    .then( function ( attDTO ) {
        res.type( attDTO.content_type );
        res.send( attDTO.data );
    });
};
