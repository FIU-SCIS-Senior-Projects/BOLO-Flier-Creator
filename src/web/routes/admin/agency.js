/* jshint node: true */
'use strict';

var fs              = require('fs');
var multiparty      = require('multiparty');
var path            = require('path');
var Promise         = require('promise');
var router          = require('express').Router();

var config          = require('../../config');
var CommonService   = config.CommonService;
var agencyRepository = new config.AgencyRepository();
var agencyService   = new config.AgencyService( agencyRepository );


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

router.use( function ( req, res, next ) {
    res.locals.admin_nav = 'admin-agency';
    next();
});

/**
 * GET /
 * Default agency route
 */
router.get('/', function (req, res) {
    agencyService.getAgencies()
    .then(function (agencies) {
        res.render('agency-list', {
            agencies: agencies
        });
    });
});


/**
 * GET /create
 * Respond with a form to create an agency.
 */
router.get('/create', function (req, res) {
    res.render('agency-create-form');
});


/**
 * POST /create
 * Process a form to create an agency.
 */
router.post('/create', function (req, res) {
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
});


/**
 * GET /edit/:id
 * Respond with a form to edit agency details
 */
router.get('/edit/:id', function (req, res) {
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
});


/**
 * POST /edit/:id
 * Process a form to edit/update agency details.
 */
router.post('/edit/:id', function (req, res) {
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

});


// handle requests for agency attachments
router.get( '/asset/:agencyId/:attname', function ( req, res ) {
    agencyService.getAttachment( req.params.agencyId, req.params.attname )
    .then( function ( attDTO ) {
        res.type( attDTO.content_type );
        res.send( attDTO.data );
    });
});

module.exports = router;
