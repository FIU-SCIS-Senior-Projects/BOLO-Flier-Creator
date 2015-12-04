/* jshint node:true */
'use strict';

var fs          = require('fs');
var multiparty  = require('multiparty');
var Promise     = require('promise');

/**
 * General helper method for parsing form data with attachments.
 */
module.exports.parseFormData = function ( req ) {
    return new Promise( function ( resolve, reject ) {
        var form = new multiparty.Form();
        var files = [];
        var fields = {};
        var result = { 'files': files, 'fields': fields };

        function addFormField ( field, value ) {
            var f = field.slice();
            if ( /\[\]$/.test( f ) ) {
                if ( ! fields[f] ) fields[f] = [];
                fields[f].push( value );
            } else {
                fields[f] = value;
            }
        }

        function addFormFile ( name, file ) {
            var dto = {
                'name': file.originalFilename,
                'content_type': file.headers['content-type'],
                'path': file.path
            };
            files.push( dto );
            addFormField( file.fieldName, dto );
        }

        form.on( 'field', addFormField );
        form.on( 'file' , addFormFile );
        form.on( 'error', function ( error ) { reject( error ); } );
        form.on( 'close', function () { resolve( result ); } );

        form.parse( req );
    });
};

/**
 * General helper method for cleaning up temporary files that were stored
 * during parsing of form data.
 */
module.exports.cleanTempFiles = function ( files ) {
    files.forEach( function ( f ) {
        fs.unlink( f.path );
    });
};

/**
 * Form Error Type
 */
function FormError ( message ) {
    this.name = 'FormError';
    this.message = message || 'An error occurred processing the form.';
    this.stack = ( new Error() ).stack;
}
FormError.prototype = Object.create( Error.prototype );
FormError.prototype.contructor = FormError;
module.exports.FormError = FormError;

