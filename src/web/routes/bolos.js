/* jshint node: true */
'use strict';

/* Module Dependencies */
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var Promise = require('promise');
var router = require('express').Router();

var core_dir = path.resolve( __dirname + '../../../core/' );
var BoloService = require( path.join( core_dir, 'service/bolo-service') );
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


function setBoloData(fields) {
    return {
        id: fields.id || '',
        authorFName: "temp",
        authorLName: "user",
        authorUName: "temp user",
        agency: "temp agency",
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
        image: fields.images || [],
        video_url: fields.video_url || '',
        additional: fields.last_known_address || '',
        summary: fields.summary || '',
        archive: false,
        enteredDT: fields.enteredDT ? fields.enteredDT : getDateTime()
    };
}

function parseFormData ( req ) {
    return new Promise( function ( resolve, reject ) {
        var form = new multiparty.Form();
        var files = [];
        var fields = {};
        var result = { 'files': files, 'fields': fields };

        form.on( 'error', function ( error ) { reject( error ); } );
        form.on( 'close', function () { resolve( result ); } );

        form.on( 'field', function ( field, value ) { fields[field] = value; } );
        form.on( 'file' , function ( name, file) {
            files.push({
                'name': file.originalFilename,
                'content_type': file.headers['content-type'],
                'path': file.path
            });
        });

        form.parse( req );
    });
}

function cleanTemporaryFiles ( files ) {
    files.forEach( function ( file ) {
        fs.unlink( file.path );
    });
}

// render the bolo create form
router.get('/create', function (req, res) {
    res.render( 'create-bolo-form' );
});

// process bolo creation user form input
router.post('/create', function(req, res) {
    var boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var boloService = new BoloService( boloRepository );

    parseFormData( req )
    .then( function ( formDTO ) {
        var boloDTO = setBoloData( formDTO.fields );
        var result = boloService.createBolo( boloDTO, formDTO.files );
        return Promise.all([ result, formDTO ]);
    })
    .then( function ( pData ) {
        if ( pData[1].files.length ) cleanTemporaryFiles( pData[1].files );
        res.redirect( '/bolo' );
    })
    .catch( function ( _error ) {
        /** @todo send back form data with error message */
        console.error( '>>> create bolo route error: ', _error );
        res.redirect( '/bolo/create' );
    });
});

router.post('/edit/:id', function (req, res) {
    var boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var boloService = new BoloService(boloRepository);

    parseFormData( req )
    .then( function ( _data ) {
        var bolodata = setBoloData( _data.fields );
        return Promise.all([ bolodata, _data.files ]);
    })
    .then( function ( _data ) {
        return boloService.updateBolo( _data[0], _data[1] );
    })
    .then( function ( _res ) {
        res.redirect( '/bolo' );
    })
    .catch( function ( _error ) {
        res.status( 500 ).send( 'something wrong happened...', _error.stack );
    });

});

router.get('', function (req, res) {
    var boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var boloService = new BoloService(boloRepository);

    boloService.getBolos()
        .then(function (bolos) {
            res.render('bolo-list', {
                bolos: bolos
            });
        });
});


router.get('/edit/:id', function (req, res) {

    var boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var boloService = new BoloService(boloRepository);

    boloService.getBolo(req.params.id)
        .then(function (bolo) {
            res.render('create-bolo-form', {
                bolo: bolo
            });
        })
        .catch(function (_error) {
            res.status(500).send('something wrong happened...', _error.stack);
        });
});
//deletes a bolo
router.post('/delete/:id', function (req, res) {
    var boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var boloService = new BoloService(boloRepository);

    return boloService.removeBolo( req.params.id )
        .then( function ( success ) {
            if ( !success ) {
                throw new Error( "Bolo not deleted. Please try again." );
            }
            res.redirect( '/bolo' );
        })
        .catch(function (_error) {
            /** @todo redirect and send flash message with error */
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

router.get( '/:id/asset/:attname', function ( req, res ) {
    var boloRepository = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var boloService = new BoloService(boloRepository);

    boloService.getAttachment( req.params.id, req.params.attname )
        .then( function ( attDTO ) {
            res.type( attDTO.content_type );
            res.send( attDTO.data );
        });
});

module.exports = router;
