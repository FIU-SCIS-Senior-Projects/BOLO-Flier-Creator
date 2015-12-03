/* jshint node: true */
'use strict';

var Promise         = require('promise');
var router          = require('express').Router();

var config          = require('../config');
var CommonService   = config.CommonService;
var boloRepository  = new config.BoloRepository();
var boloService     = new config.BoloService( boloRepository );

var formUtil        = require('../lib/form-util');

var GFERR           = config.const.GFERR;
var GFMSG           = config.const.GFMSG;

var getDateTime         = CommonService.getDateTime;
var parseFormData       = formUtil.parseFormData;
var cleanTemporaryFiles = formUtil.cleanTempFiles;

function setBoloData(fields) {
    return {
        id: fields.id || '',
        createdOn: fields.enteredDT ? fields.enteredDT : getDateTime(),
        lastUpdatedOn: fields.lastUpdatedOn ? fields.lastUpdatedOn : getDateTime(),
        category: fields.bolo_category != 'Select an option...' ? fields.bolo_category : '',
        firstName: fields.fname || '',
        lastName: fields.lname || '',
        dob: fields.dob || '',
        dlNumber: fields.dl_number || '',
        race: fields.race || '',
        sex: fields.sex != 'Select an option...' ? fields.sex : '',
        height: fields.height || '',
        weight: fields.weight || '',
        hairColor: fields.hair_color != 'Select an option...' ? fields.hair_color : '',
        tattoos: fields.tattoos || '',
        address: fields.address || '',
        additional: fields.last_known_address || '',
        summary: fields.summary || '',
        attachments: {},
        video_url: fields.video_url || '',
        isActive: fields.isActive || true,
        status: fields.status || "New"
    };
}


// list bolos at the root route
router.get('/bolo', function (req, res) {
    var pageSize = 2;
    var currentPage = req.query.page || 1;

    boloService.getBolos(pageSize, currentPage)
        .then(function (result) {
            res.render('bolo-list', {
                bolos: result.bolos,
                paging: {
                    pages: result.pages,
                    currentPage: currentPage
                }
            });
        });
});


// list archive bolos
router.get('/bolo/archive', function (req, res) {
    var pageSize = 2;
    var currentPage = req.query.page || 1;

    boloService.getArchiveBolos(pageSize, currentPage)
        .then(function (result) {
            res.render('bolo-archive', {
                bolos: result.bolos,
                paging: {
                    pages: result.pages,
                    currentPage: currentPage
                }
            });
        });
});

// render the bolo create form
router.get('/bolo/create', function (req, res) {
    res.render('bolo-create-form');
});

// process bolo creation user form input
router.post('/bolo/create', function (req, res) {
    parseFormData(req)
        .then(function (formDTO) {
            var boloDTO = setBoloData(formDTO.fields);

            boloDTO.authorFName = req.user.fname;
            boloDTO.authorLName = req.user.lname;
            boloDTO.authorUName = req.user.username;
            boloDTO.agency = req.user.agency;

            var result = boloService.createBolo(boloDTO, formDTO.files);
            return Promise.all([result, formDTO]);
        })
        .then(function (pData) {
            if (pData[1].files.length) cleanTemporaryFiles(pData[1].files);
            res.redirect('/bolo');
        })
        .catch(function (_error) {
            /** @todo send back form data with error message */
            console.error('>>> create bolo route error: ', _error);
            res.redirect('/bolo/create');
        });
});

// render the bolo edit form
router.get('/bolo/edit/:id', function (req, res) {
    boloService.getBolo(req.params.id)
        .then(function (bolo) {
            res.render('bolo-create-form', {
                bolo: bolo
            });
        })
        .catch(function (_error) {
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

// handle requests to process edits on a specific bolo
router.post('/bolo/edit/:id', function (req, res) {
    parseFormData(req)
        .then(function (formDTO) {
            var boloDTO = setBoloData(formDTO.fields);
            boloDTO.lastUpdatedOn = getDateTime();
            var result = boloService.updateBolo(boloDTO, formDTO.files);
            return Promise.all([result, formDTO]);
        })
        .then(function (pData) {
            if (pData[1].files.length) cleanTemporaryFiles(pData[1].files);
            res.redirect('/bolo');
        })
        .catch(function (_error) {
            console.error('>>> edit bolo route error: ', _error);
            res.redirect('back');
        });

});

// handle requests to inactivate a specific bolo
router.post('/bolo/archive/:id', function (req, res) {
    var activate = false;

    boloService.activate(req.params.id, activate)
        .then(function (success) {
            if (!success) {
                throw new Error("Bolo not inactivated. Please try again.");
            }
            res.redirect('/bolo');
        })
        .catch(function (_error) {
            /** @todo redirect and send flash message with error */
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

router.post('/bolo/restore/:id', function (req, res) {
    var activate = true;

    boloService.activate(req.params.id, activate)
        .then(function (success) {
            if (!success) {
                throw new Error("Bolo not activated. Please try again.");
            }
            res.redirect('/bolo/archive');
        })
        .catch(function (_error) {
            /** @todo redirect and send flash message with error */
            res.status(500).send('something wrong happened...', _error.stack);
        });
});


router.post('/bolo/delete/:id', function (req, res) {
    boloService.removeBolo(req.params.id)
        .then(function (success) {
            if (!success) {
                throw new Error("Bolo not deleted. Please try again.");
            }
            res.redirect('/bolo');
        })
        .catch(function (_error) {
            // @todo redirect and send flash message with error 
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

// handle requests to view the details of a bolo
router.get('/bolo/details/:id', function (req, res) {
    boloService.getBolo(req.params.id)
        .then(function (bolo) {
            res.render('bolo-details', {
                bolo: bolo
            });
        })
        .catch(function (_error) {
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

// handle requests for bolo attachments
router.get('/bolo/asset/:boloid/:attname', function (req, res) {
    boloService.getAttachment(req.params.boloid, req.params.attname)
        .then(function (attDTO) {
            res.type(attDTO.content_type);
            res.send(attDTO.data);
        });
});

module.exports = router;
