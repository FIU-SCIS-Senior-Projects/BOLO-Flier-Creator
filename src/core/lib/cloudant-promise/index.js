/* jshint node: true */
'use strict';

var connection = require('./cloudant-connection');
var Promise = require('promise');

var config_wrapper = {};
var db_wrapper = {};

config_wrapper.use = function ( db_name ) {
    return Object.create( db_wrapper, {
        'db': {
            'value': connection.db.use( db_name ),
            'writabe': false
        }
    });
};

db_wrapper.insert = function ( doc, params ) {
    var context = this;
    if ( !params ) params = null;
    return new Promise( function ( resolve, reject ) {
        context.db.insert( doc, function ( err, body ) {
            if ( !err ) resolve( body );
            reject( err );
        });
    });
};

db_wrapper.insertMultipart = function ( doc, attachments, params ) {
    var context = this;
    return new Promise( function ( resolve, reject ) {
        context.db.multipart.insert( doc, attachments, params, function ( err, body ) {
            if ( !err ) resolve( body );
            reject( err );
        });
    });
};

db_wrapper.get = function ( docname ) {
    var context = this;
    return new Promise( function ( resolve, reject ) {
        context.db.get( docname, function ( err, body ) {
            if ( !err ) resolve( body );
            reject( err );
        });
    });
};

db_wrapper.getAttachment = function ( docname, attname, params ) {
    var context = this;
    return new Promise( function ( resolve, reject ) {
        context.db.attachment.get( docname, attname, params, function ( err, body ) {
            if ( !err ) resolve( body );
            reject( err );
        });
    });
};

db_wrapper.list = function ( params ) {
    var context = this;
    return new Promise( function ( resolve, reject ) {
        context.db.list( params, function ( err, body ) {
            if ( !err ) resolve( body );
            reject( err );
        });
    });
};

db_wrapper.destroy = function ( docname, rev ) {
    var context = this;
    return new Promise( function ( resolve, reject ) {
        context.db.destroy( docname, rev, function ( err, body ) {
            if ( !err ) resolve( body );
            reject( err );
        });
    });
};

db_wrapper.view = function ( designname, viewname, params ) {
    var context = this;
    if ( !params ) params = null;
    return new Promise( function ( resolve, reject ) {
        context.db.view( designname, viewname, params, function ( err, body ) {
            if ( !err ) resolve( body );
            reject( err );
        });
    });
};


module.exports.db = config_wrapper;
