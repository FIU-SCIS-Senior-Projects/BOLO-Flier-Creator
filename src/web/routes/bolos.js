/* jshint node: true */
'use strict';

/* Module Dependencies */
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
        _id: fields._id || '',
        _rev: fields._rev || '',
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
        var files = [],
            fields = {};
        var result = { 'files': files, 'fields': fields };

        form
        .on( 'error', function ( error )        { reject( error ); })
        .on( 'close', function ( )              { resolve( result ); })
        .on( 'field', function ( field, value ) { fields[field] = value; })
        .on( 'file',  function ( name, file )   { files.push( file ); });
        /* TODO
         * BoloService expect files to be in a specific structure.
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
    var storageAdapter = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var mediaAdapter = AdapterFactory.create('media', 'ibm-object-storage-adapter');
    var boloService = new BoloService( storageAdapter, mediaAdapter );

    var imagePathFilter = function ( item ) { return item.path; };

    parseFormData( req )
    .then( function ( _data ) {
        var bolodata = setBoloData( _data.fields );
        var paths = _data.files.map( function ( f ) { return f.path; } );
        return Promise.all([ bolodata, paths ]);
    })
    .then( function ( _data ) {
        return boloService.createBolo( _data[0], { image: _data[1] } );
    })
    .then( function ( _res ) {
        res.send( _res );
    })
    .catch( function ( _error ) {
        res.status( 500 ).send( 'something wrong happened...', _error.stack );
    });

});
router.post('/edit/:id', function (req, res) {
    var storageAdapter = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var mediaAdapter = AdapterFactory.create('media', 'ibm-object-storage-adapter');
    var boloService = new BoloService(storageAdapter, mediaAdapter);

    var imagePathFilter = function (item) {
        return item.path;
    };

    parseFormData(req)
        .then(function (_data) {
            var bolodata = setBoloData(_data.fields);
            var paths = _data.files.map(function (f) {
                return f.path;
            });
            return Promise.all([bolodata, paths]);
        })
        .then(function (_data) {
            boloService.createBolo(_data[0], {
                image: _data[1]
            });
        })
        .then(function (_res) {
            boloService.getBolos()
                .then(function (bolos) {
                    res.render('bolo-list', {
                        bolos: bolos
                    });
                });
        })
        .catch(function (_error) {
            res.status(500).send('something wrong happened...', _error.stack);
        });

});

router.get('', function (req, res) {
    var storageAdapter = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var mediaAdapter = AdapterFactory.create('media', 'ibm-object-storage-adapter');
    var boloService = new BoloService(storageAdapter, mediaAdapter);

    boloService.getBolos()
        .then(function (bolos) {
            res.render('bolo-list', {
                bolos: bolos
            });
        });
});

router.get('/edit/:id', function (req, res) {

    var storageAdapter = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var mediaAdapter = AdapterFactory.create('media', 'ibm-object-storage-adapter');
    var boloService = new BoloService(storageAdapter, mediaAdapter);

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
    var storageAdapter = AdapterFactory.create( 'persistence', 'cloudant-bolo-repository' );
    var mediaAdapter = AdapterFactory.create('media', 'ibm-object-storage-adapter');
    var boloService = new BoloService(storageAdapter, mediaAdapter);

    var bolo;
    boloService.getBolo(req.params.id)
        .then(function (result) {
            this.bolo = result;
        })
        .then(function (_res) {
            boloService.removeBolo(bolo._id, bolo._rev);
        })
        .catch(function (_error) {

        });
});


module.exports = router;
