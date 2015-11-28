/* jshint node: true */
'use strict';

/* Module Dependencies */
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var Promise = require('promise');
var router = require('express').Router();

var config = require('../config');
var boloRepository = new config.BoloRepository();
var boloService = new config.BoloService( boloRepository );

//gets current time; useful for bolo creation and update
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    //Append 0 to all values less than 10;
    hour = (hour < 10 ? "0" : "") + hour;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}


function setBoloData(fields) {
    return {
        id: fields.id || '',
        createdOn: fields.enteredDT ? fields.enteredDT : getDateTime(),
        lastUpdatedOn: fields.lastUpdatedOn ? fields.lastUpdatedOn : getDateTime(),
        agency: "Pinecrest Police Department",
        authorFName: "Jason",
        authorLName: "Cohen",
        authorUName: "Jason Cohen",
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
            if (file.originalFilename)
                files.push({
                    'name': file.originalFilename,
                    'content_type': file.headers['content-type'],
                    'path': file.path
                });
        });

        form.parse(req);
    });
}

function cleanTemporaryFiles(files) {
    files.forEach(function (file) {
        fs.unlink(file.path);
    });
}

// list bolos at the root route
router.get('/', function (req, res) {
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
router.get('/archive', function (req, res) {
    boloService.getArchiveBolos()
        .then(function (bolos) {
            res.render('bolo-archive', {
                bolos: bolos
            });
        });
});

// render the bolo create form
router.get('/create', function (req, res) {
    res.render('bolo-create-form');
});

// process bolo creation user form input
router.post('/create', function (req, res) {
    parseFormData(req)
        .then(function (formDTO) {
            var boloDTO = setBoloData(formDTO.fields);
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
router.get('/edit/:id', function (req, res) {
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
router.post('/edit/:id', function (req, res) {
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
router.post('/archive/:id', function (req, res) {
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

router.post('/restore/:id', function (req, res) {
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


router.post('/delete/:id', function (req, res) {
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
router.get('/details/:id', function (req, res) {
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
router.get('/asset/:boloid/:attname', function (req, res) {
    boloService.getAttachment(req.params.boloid, req.params.attname)
        .then(function (attDTO) {
            res.type(attDTO.content_type);
            res.send(attDTO.data);
        });
});

function ArchiveRestoreBolo(boloId, activate) {


}

module.exports = router;
