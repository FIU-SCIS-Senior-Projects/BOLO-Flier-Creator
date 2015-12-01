/* jshint node:true */
'use strict';

var fs          = require('fs');
var multiparty  = require('multiparty');
var Promise     = require('promise');

module.exports.parseFormData = function ( req ) {
    return new Promise( function ( resolve, reject ) {
        var form = new multiparty.Form();
        var files = [];
        var fields = {};
        var result = { 'files': files, 'fields': fields };

        form.on( 'error', function ( error ) { reject( error ); } );
        form.on( 'close', function () { resolve( result ); } );

        form.on( 'field', function ( field, value ) {
            var f = field.slice();
            if ( /\[\]$/.test( f ) ) {
                if ( ! fields[f] ) fields[f] = [];
                fields[f].push( value );
            } else {
                fields[f] = value;
            }
        });

        form.on( 'file' , function ( name, file) {
            files.push({
                'name': file.originalFilename,
                'content_type': file.headers['content-type'],
                'path': file.path
            });
        });

        form.parse( req );
    });
};

module.exports.cleanTempFiles = function ( files ) {
    files.forEach( function ( f ) {
        fs.unlink( f.path );
    });
};
