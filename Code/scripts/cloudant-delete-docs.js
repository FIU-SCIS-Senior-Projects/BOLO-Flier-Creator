/* jshint node:true */
'use strict';

var _           = require('lodash');
var path        = require('path');
var Promise     = require('promise');
var util        = require('util');

require('dotenv').config({ 'path': path.resolve( __dirname, '../.env' ) });
var cloudant = require('./cloudant-connection.js');

var BOLO_DB = 'bolo';
var CHUNK_SIZE = 10;

function deleteByView ( dbname, designname, viewname ) {
    getView( dbname, designname, viewname ).then( function ( list ) {
        if ( ! list.rows.length ) {
            console.log( '> Nothing to delete.' );
            return Promise.resolve( true );
        }
        var docs = list.rows.map( function ( item ) {
            return {
                '_id': item.id,
                '_rev': item.value,
                '_deleted': true
            };
        });

        var chunks = _.chunk( docs, CHUNK_SIZE );

        return Promise.all( chunks.map( function ( chunk ) {
            return bulkDelete( dbname, chunk );
        }));
    }).then( function ( response ) {
        console.log( response );
    }).catch( function ( error ) {
        console.error( error );
    });
}

function getView ( dbname, designname, viewname ) {
    var db = cloudant.db.use( dbname );
    return new Promise( function ( resolve, reject ) {
        db.view( designname, viewname, function ( err, body ) {
            if ( err ) reject( err );
            resolve( body );
        });
    });
}

function bulkDelete ( dbname, docs ) {
    var db = cloudant.db.use( dbname );
    var req_body = { 'docs': docs };
    return new Promise( function ( resolve, reject ) {
        db.bulk( req_body, function ( err, body ) {
            if ( err ) reject( err );
            resolve( body );
        });
    });
}

deleteByView( BOLO_DB, 'agency', 'revs' ).then( function ( result ) {
    console.log( '> Deleted ', result.length );
});
