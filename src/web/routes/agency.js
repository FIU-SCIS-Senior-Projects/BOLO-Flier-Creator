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
        zip: fields.zip || '',
        phone: fields.phone || '',
        logo: fields.logo || '',
        shield: fields.shield || '',
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
    res.render('agency-list');
});
/*

//Updates an Agency. Can only be used by tier 1 user or agency chief
router.put('', function(request, response) {
    var priviledge = getPriviledge(request.cookies.boloUsername);
    var agencies = cloudant.db.use('bolo_agencies');

    agencies.get(request.body.name, function(error, agency) {
        if (priviledge > 1 || request.cookies.boloUsername == agency.chief) {
            //edit agency data
            agencies.put({
                name: request.body.name,
                address: {
                    address: request.body.address,
                    city: request.body.city,
                    zip: request.body.zip
                },
                phone: request.body.phone,
                shield: request.body.shieldImage,
                logo: request.body.logoImage,
                chief: request.body.chief
            }, request.body.name, function(err, doc) {
                if(err) {
                    response.json({Result: 'Failure', Message: 'Unable to update Agency. Please Try again later.'});
                }
                else {
                    response.json({Result: 'Success', Message: 'Agency succesfully updated.'});
                }
            });
        }
        else {
            //user lacks right to edit
            response.json({Result: 'Failure', Message: 'Insufficient Priviledges'});
        }
    });//end of agencies get
});


//Grabs info on an agency
router.get('', function(request, response) {
    var agencies = cloudant.db.use('bolo_agencies');

    agencies.get(request.query.agency, function(error, agency) {
        if (error) {
            response.json({Result: 'Failure', Message: 'Unable to retrieve agency. It may not exist.'});
        }
        else {
            response.json({ Name: agency.name,
                Address: {address: agency.address.address, city: agency.address.city, zip: agency.address.zip},
                Phone: agency.phone, shield: agency.shield, logo: agency.logo, chief: agency.chief });
        }
    });
});

//Delete an agency from the database
router.delete('', function(request, response) {
    var agencies = cloudant.db.use('bolo_agencies");');
        agencies.get("bolo"+request.body.boloID, function(err, agency) {

            if (err) {
                response.json({ Result: 'Failure', Message: 'Agency not found' });
            }
            else {
                var revisionID = agency._rev;
                var name = request.body.name;
                console.log("Deleting " +name+" agency.\n");

                agencies.destroy(name, revisionID, function(error, body) {
                    if (error) {
                        console.log("Unable to delete "+name+" agency.\n", error);
                            response.json({ Result: 'Failure', Message: 'Unable to delete agency.',
                                Agency: name});
                    }
                    else {
                        console.log("Successfully deleted "+name+" agency.\n");
                        response.json({ Result: 'Success', Message: 'Agency has been deleted.',
                            Agency: name});
                    }
                });//end of destroy

            }
        });//end agencies.get currentUserCount
});

*/

module.exports = router;
