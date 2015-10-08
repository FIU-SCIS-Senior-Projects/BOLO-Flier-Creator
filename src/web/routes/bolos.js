/* jshint node: true */
'use strict';

/* Module Dependencies */
var multiparty = require('multiparty');
var path = require('path');
var Promise = require('promise');
var router = require('express').Router();

var cloudant = require('../lib/cloudant-connection.js');

var core_dir = path.resolve( __dirname + '../../../core/' );
var ClientAccessPort = require( path.join( core_dir, 'ports/client-access-port') );
var AdapterFactory = require( path.join( core_dir, 'adapters' ) );

//gets current time; useful for bolo creation and update
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay();

    //Append 0 to all values less than 10;
    hour = (hour < 10 ? "0" : "") + hour;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}
var clientAccess = new ClientAccessPort();
var cloudantAdapter = AdapterFactory.create('storage', 'cloudant');


function setBoloData ( fields ) {
    return {
        authorFName     : "temp",
        authorLName     : "user",
        authorUName     : "temp user",
        agency          : "temp agency",
        category        : fields.bolo_category      || '',
        firstName       : fields.fname              || '',
        lastName        : fields.lname              || '',
        dob             : fields.dob                || '',
        dlNumber        : fields.dl_number          || '',
        race            : fields.race               || '',
        sex             : fields.sex                || '',
        height          : fields.height             || '',
        weight          : fields.weight             || '',
        hairColor       : fields.hair_color         || '',
        tattoos         : fields.tattoos            || '',
        address         : fields.address            || '',
        image           : fields.images             || [],
        video_url       : fields.video_url          || '',
        additional      : fields.last_known_address || '',
        summary         : fields.summary            || '',
        archive         : false
    };
}

function parseFormData ( req ) {
    return new Promise( function ( resolve, reject ) {
        var form = new multiparty.Form();
        var files = [],
            fields = {};
        var result = { 'files': files, 'fields': fields };

        form
        .on( 'error', function ( error )        { reject( error ); })
        .on( 'close', function ( )              { resolve( result ); })
        .on( 'field', function ( field, value ) { fields[field] = value; })
        .on( 'file',  function ( name, file )   { files.push( file ); });
        /* TODO
         * ClientAccessPort expect files to be in a specific structure.
         * Filter the type of file and structure files accordingly.
         * format := { image: [], video: [], audio: [] }
         */

        form.parse( req );
    });
}


// render the bolo create form
router.get('/create', function (req, res) {
/** @todo Take a look to this later*/
    res.render('create-bolo-form', {bolo:undefined});
});

//create a BOLO report
router.post('/create', function(req, res) {
    var storageAdapter = AdapterFactory.create( 'storage', 'cloudant' );
    var mediaAdapter = AdapterFactory.create( 'media', 'ibm-object-storage' );
    var clientAccess = new ClientAccessPort( storageAdapter, mediaAdapter );

    var imagePathFilter = function ( item ) { return item.path; };

    parseFormData( req )
    .then( function ( _data ) {
        var bolodata = setBoloData( _data.fields );
        var paths = _data.files.map( function ( f ) { return f.path; } );
        return Promise.all([ bolodata, paths ]);
    })
    .then( function ( _data ) {
        return clientAccess.createBolo( _data[0], { image: _data[1] } );
    })
    .then( function ( _res ) {
        res.send( _res );
    })
    .catch( function ( _error ) {
        res.status( 500 ).send( 'something wrong happened...', _error.stack );
    });

});

router.get('', function (req, res) {
    var results = clientAccess.getBolos(
        function (results) {
            res.render('bolo-list', {
                bolos: results
            });
        }, cloudantAdapter);
});

router.get('/edit/:id', function (req, res) {

    var results = clientAccess.getBolo(req.params.id,
        function (result) {
            if (result) {
                res.render('create-bolo-form', {
                    bolo: result
                });
            } else {
                res.status(404).send("Bolo not found");
            }
        }, cloudantAdapter);
});

//deletes a bolo
router.delete('', function (req, res) {

    var fliers = cloudant.db.use('bolo_fliers');
    var results = clientAccess.deleteBolo(function (re) {});
    fliers.get("bolo" + req.body.boloID, function (err, bolo) {

        if (err) {
            res.json({
                Result: 'Failure',
                Message: 'Bolo not found'
            });
        } else {
            var revisionID = bolo._rev;
            var boloID = req.body.boloID;
            console.log("Deleting bolo with ID#" + boloID + "\n");

            fliers.destroy("bolo" + boloID, revisionID, function (error, body) {
                if (error) {
                    console.log("Unable to delete bolo with ID#" + boloID + ".\n", error);
                    res.json({
                        Result: 'Failure',
                        Message: 'Unable to delete bolo.',
                        boloID: boloID
                    });
                } else {
                    console.log("Successfully deleted bolo with ID#" + boloID + "\n");
                    res.json({
                        Result: 'Success',
                        Message: 'Bolo has been deleted.',
                        boloID: boloID
                    });
                }
            }); //end of destroy

        }
    }); //end flier.get currentUserCount

});

//updates a field in a bolo
router.put('', function (req, res) {

    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("bolo" + req.query.boloID, function (err, bolo) {

        if (err) {
            res.json({
                Result: 'Failure',
                Message: 'Bolo not found'
            });
        } else {
            var revisionID = bolo._rev;
            var boloID = bolo.boloID;
            console.log("Updating bolo with ID#" + bolo.boloID + "\n");
            fliers.insert({
                _rev: revisionID,
                lastUpdate: getDateTime(),
                category: req.body.category,
                imageURL: req.body.imageURL,
                videoLink: req.body.videoLink,
                firstName: req.body.fName,
                lastName: req.body.lName,
                dob: req.body.dob,
                dlNumber: req.body.dlNumber,
                race: req.body.race,
                sex: req.body.sex,
                height: req.body.height,
                weight: req.body.weight,
                hairColor: req.body.hairColor,
                tattoos: req.body.tattoos,
                address: req.body.address,
                additional: req.body.additional,
                summary: req.body.summary,
                agency: req.body.agency
            }, "bolo" + req.query.boloID, function (err, doc) {
                //TODO: fix code below
                //if user creation failed, log the error and return a message
                if (err) {
                    console.log(err);
                    res.json({
                        Result: 'Failure',
                        Message: 'Unable to find BOLO'
                    });
                } else {
                    //if it succeeded, inform the user
                    console.log("Updated BOLO with ID#" + req.query.boloID);

                    res.json({
                        Result: 'Success',
                        Message: 'BOLO Successfully Updated.',
                        boloID: req.query.boloID
                    });
                }

            }); //end flier update

        }
    }); //end flier.get currentUserCount
});


module.exports = router;