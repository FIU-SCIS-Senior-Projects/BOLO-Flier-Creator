/* jshint node:true */
'use strict';

var path        = require('path');
var Promise     = require('promise');
var util        = require('util');

require('dotenv').config({ 'path': path.resolve( __dirname, '../.env' ) });

var cloudant = require('./cloudant-connection.js');


var BOLO_DB = 'bolo-test';

var BOLO_DESIGN_DOC = {
    "views": {
        "all_active": {
            "map": "function (doc) {\n  if ( 'bolo' === doc.Type && !doc.archive )\n    emit(doc._id, 1);\n}"
        },
        "all_archive": {
            "map": "function (doc) {\n  if ( 'bolo' === doc.Type && doc.archive )\n    emit(doc._id, 1);\n}"
        },
        "all": {
            "map": "function (doc) {\n  if ( 'bolo' === doc.Type )\n    emit(doc._id, 1);\n}"
        }
    }
};

var USERS_DESIGN_DOC = {
    "views": {
        "by_username": {
            "map": "function (doc) {\n  if ( 'user' === doc.Type )\n    emit(doc.username, null);\n}"
        },
        "all": {
            "map": "function (doc) {\n  if ( 'user' === doc.Type )\n    emit(doc._id, 1);\n}"
        }
    }
};

var AGENCY_DESIGN_DOC = {
    "views": {
        "by_agency": {
            "map": "function (doc) {\n  if ( 'agency' === doc.Type )\n    emit(doc.name, null);\n}"
        },
        "all_active": {
            "map": "function (doc) {\n  if ( 'agency' === doc.Type )\n    emit(doc._id, null);\n}"
        }
    }
};


function destroyDB ( dbname ) {
    return new Promise( function ( resolve, reject ) {
        cloudant.db.destroy( dbname, function ( err, body ) {
            if ( err ) reject( err );
            resolve( body );
        });
    });
}

function createDB ( name ) {
    return new Promise( function ( resolve, reject ) {
        cloudant.db.create( name, function ( err, body ) {
            if ( err ) reject( err );
            resolve( body );
        });
    });
}

function createDesign ( dbname, designname, doc ) {
    return new Promise( function ( resolve, reject ) {
        var db = cloudant.db.use( dbname );
        db.insert( doc, '_design/' + designname, function ( err, body ) {
            if ( err ) reject( err );
            resolve( body );
        });
    });
}

function createDoc ( dbname, doc ) {
    return new Promise( function ( resolve, reject ) {
        var db = cloudant.db.use( dbname );
        db.insert( doc, function ( err, body ) {
        });
    });
}

function resetDB() {
    return destroyDB( BOLO_DB )
    .then( function ( response ) {
        console.log( '> Old database destroyed.' );
        return createDB( BOLO_DB );
    }, function ( error ) {
        if ( ! error.reason.match( /does not exist/i ) ) {
            throw new Error( error.reason );
        }
        console.log( '> No database to destroy, moving on.' );
        return createDB( BOLO_DB );
    })
    .then( function ( response ) {
        console.log( '> Database created.' );
        var ad = createDesign( BOLO_DB, 'agency', AGENCY_DESIGN_DOC );
        var bd = createDesign( BOLO_DB, 'bolo', BOLO_DESIGN_DOC );
        var ud = createDesign( BOLO_DB, 'users', USERS_DESIGN_DOC ); 
        return Promise.all([ ad, bd, ud ]);
    })
    .then( function ( responses ) {
        console.log( '> Design documents created. ' );
    })
    .catch( function ( error ) {
        console.error( 'Error: ', error.message );
    });
}

function authorizeReset () {
    process.stdout.write(
        ' This script will destroy the "' + BOLO_DB + '" database and set it' +
        ' up to a default state.\n\n CONTINUE?  [y/n]  '
    );

    process.stdin.resume();
    process.stdin.setEncoding( 'utf8' );

    process.stdin.on( 'data', function ( text ) {
        if ( text.match( /^y(es)?\s+$/i ) ) {
            resetDB().then( process.exit );
        } else {
            console.log( '> Cancelled.' );
            process.exit();
        }
    });
}

/** Start the script **/
authorizeReset();
