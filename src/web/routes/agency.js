/* jshint node: true */
'use strict';

/* Module Dependencies */
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var Promise = require('promise');
var router = require('express').Router();

var core_dir = path.resolve(__dirname + '../../../core/');

var AgencyService = require(path.join(core_dir, 'service/agency-service'));
var CommonService = require(path.join(core_dir, 'service/common-service'));
var AdapterFactory = require(path.join(core_dir, 'adapters'));


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

router.get('/create', function (req, res) {
    res.render('create-agency');
});

//creates an agency
router.post('/create', function (req, resp) {

    var agencyRepository = AdapterFactory.create('persistence', 'cloudant-agency-repository');
    var agencyService = new AgencyService(agencyRepository);
    parseFormData(req)
        .then(function (formDTO) {
            var agencyDTO = setAgencyData(formDTO.fields);
            var result = agencyService.createAgency(agencyDTO, formDTO.files);
            return Promise.all([result, formDTO]);
        })
        .then(function (pData) {
            if (pData[1].files.length) CommonService.cleanTemporaryFiles(pData[1].files);
            resp.redirect('/agency');
        })
        .catch(function (_error) {
            /** @todo send back form data with error message */
            console.error('>>> create agency route error: ', _error);
        });
});


router.get('', function (req, res) {
    //res.render('agency-list');
    var agencyRepository = AdapterFactory.create( 'persistence', 'cloudant-agency-repository' );
    var agencyService = new AgencyService(agencyRepository);

    agencyService.getAgencies()
        .then(function (agencies) {
            console.log(agencies);
            res.render('agency-list', {
                agencies: agencies
            });
        });
});
// render the agency edit form
router.get('/edit/:id', function (req, res) {

    var agencyRepository = AdapterFactory.create( 'persistence', 'cloudant-agency-repository' );
    var agencyService = new AgencyService(agencyRepository);

    agencyService.getAgency(req.params.id)
        .then(function (agency) {
            console.log("Agency>>>>", agency);
            res.render('create-agency', {
                agency: agency
            });
        })
        .catch(function (_error) {
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

// update agency
router.post('/edit/:id', function (req, res) {
    var agencyRepository = AdapterFactory.create( 'persistence', 'cloudant-agency-repository' );
    var agencyService = new AgencyService(agencyRepository);

    parseFormData( req )
    .then( function ( formDTO ) {
        var agencyDTO = setAgencyData( formDTO.fields );
        var result = agencyService.updateAgency( agencyDTO, formDTO.files );
        return Promise.all([ result, formDTO ]);
    })
    .then( function ( pData ) {
        if ( pData[1].files.length ) CommonService.cleanTemporaryFiles( pData[1].files );
        res.redirect( '/agency' );
    })
    .catch( function ( _error ) {
        console.log( '>>> edit agency route error: ', _error );
        res.redirect( 'back' );
    });

});


// handle requests for agency attachments
router.get( '/asset/:agencyId/:attname', function ( req, res ) {
    var agencyRepository = AdapterFactory.create( 'persistence', 'cloudant-agency-repository' );
    var agencyService = new AgencyService(agencyRepository);

    agencyService.getAttachment( req.params.agencyId, req.params.attname )
        .then( function ( attDTO ) {
            res.type( attDTO.content_type );
            res.send( attDTO.data );
        });
});

module.exports = router;
