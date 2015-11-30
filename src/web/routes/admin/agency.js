/* jshint node: true */
'use strict';

var fs              = require('fs');
var multiparty      = require('multiparty');
var path            = require('path');
var Promise         = require('promise');

var config          = require('../../config');
var CommonService   = config.CommonService;
var agencyRepository = new config.AgencyRepository();
var agencyService   = new config.AgencyService( agencyRepository );

var GFERR           = config.const.GFERR;
var GFMSG           = config.const.GFMSG;


function parseFormData(req) {
    return new Promise(function (resolve, reject) {
        var form = new multiparty.Form();
        var files = [];
        var fields = {};
        var result = { 'files': files, 'fields': fields };

        form.on('error', function (error) { reject(error); });
        form.on('close', function () { resolve(result); });

        form.on('field', function (field, value) { fields[field] = value; });
        form.on('file', function (name, file) {
            files.push({
                'name': file.originalFilename,
                'content_type': file.headers['content-type'],
                'path': file.path
            });
        });

        form.parse(req);
    });
}

function setAgencyData(fields) {
    return {
        id: fields.id || '',
        name: fields.name || '',
        address: fields.address || '',
        city: fields.city || '',
        state: fields.state || '',
        zip: fields.zip || '',
        phone: fields.phone || '',
        isActive: fields.isActive || true
        //enteredDT   : fields.enteredDT ? fields.enteredDT : CommonService.getDateTime()
    };
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
    parseFormData(req)
    .then(function (formDTO) {
        var agencyDTO = setAgencyData(formDTO.fields);
        var result = agencyService.createAgency(agencyDTO, formDTO.files);
        return Promise.all([result, formDTO]);
    })
    .then(function (pData) {
        if (pData[1].files.length) CommonService.cleanTemporaryFiles(pData[1].files);
        res.redirect('/admin/agency');
    })
    .catch(function (error) {
        /** @todo send back form data with error message */
        console.error('>>> create agency route error: ', error);
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
    parseFormData( req )
    .then( function ( formDTO ) {
        var agencyDTO = setAgencyData( formDTO.fields );
        var result = agencyService.updateAgency( agencyDTO, formDTO.files );
        return Promise.all([ result, formDTO ]);
    })
    .then( function ( pData ) {
        if ( pData[1].files.length ) CommonService.cleanTemporaryFiles( pData[1].files );
        res.redirect( '/admin/agency' );
    })
    .catch( function ( _error ) {
        console.error( '>>> edit agency route error: ', _error );
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

