/* jshint node: true */
'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var Promise = require('promise');
var router = require('express').Router();

var core = path.resolve( __dirname, '../../core/' );
var UserService = require( path.join( core, 'service/user-service' ) );
var AdapterFactory = require( path.join( core, 'adapters' ) );

module.exports = router;

/** @todo Extract into a common library */
function cleanTemporaryFiles ( files ) {
    files.forEach( function ( file ) {
        fs.unlink( file.path );
    });
}

function setUserData ( fields ) {
    return {
        'id'            : fields.id || '',
        'username'      : fields.username || '',
        'email'         : fields.email || '',
        'fname'         : fields.fname || '',
        'lname'         : fields.lname || '',
        'password'      : fields.password || '',
        'tier'          : 1,
        'badge'         : fields.badge || '',
        'secunit'       : fields.securnit || '',
        'ranktitle'     : fields.ranktitle || ''
        /** @todo 'tier' needs to be handled somewhere */
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

/**
 * GET /createuser
 * Responds with a form to create a new user.
 */
router.get( '/createuser', function ( req, res ) {
    res.render( 'create-user-form' );
});
