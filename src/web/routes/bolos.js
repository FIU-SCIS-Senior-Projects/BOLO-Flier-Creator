/* jshint node: true */
'use strict';

var _               = require('lodash');
var jade            = require('jade');
var moment          = require('moment');
var path            = require('path');
var Promise         = require('promise');
var router          = require('express').Router();
var util            = require('util');
var uuid            = require('node-uuid');

var config          = require('../config');
var userService     = new config.UserService( new config.UserRepository() );
var boloService     = new config.BoloService( new config.BoloRepository() );
var agencyService   = new config.AgencyService( new config.AgencyRepository() );
var emailService    = config.EmailService;
var BoloAuthorize   = require('../lib/authorization.js').BoloAuthorize;

var formUtil        = require('../lib/form-util');

var GFERR           = config.const.GFERR;
var GFMSG           = config.const.GFMSG;

var parseFormData       = formUtil.parseFormData;
var cleanTemporaryFiles = formUtil.cleanTempFiles;


/**
 * Send email notification of a new bolo.
 */
function sendBoloNotificationEmail ( bolo, template ) {
    return userService.getAgencySubscribers( bolo.agency )
    .then( function ( users ) {
        var subscribers = users.map( function( user ) {
            return user.email;
        });

        var tmp = config.email.template_path + '/' + template + '.jade';
        var tdata = {
            'bolo': bolo,
            'app_url': config.appURL
        };
        /** @todo check if this is async **/
        var html = jade.renderFile( tmp, tdata );

        return emailService.send({
            'to': subscribers,
            'from': config.email.from,
            'fromName': config.email.fromName,
            'subject' : 'BOLO Alert: ' + bolo.category,
            'html': html
        });
    })
    .catch( function ( error ) {
        console.error(
            'Unknown error occurred while sending notifications to users' +
            'subscribed to agency id %s for BOLO %s\n %s',
            bolo.agency, bolo.id, error.message
        );
    });
}

/**
 * @todo an optimization could probably be made here by creating a view for
 * this type of data in Cloudant (if its still being used).
 */
function getAllBoloData ( id ) {
    var data = {};

    return boloService.getBolo( id ).then( function ( bolo ) {
        data.bolo = bolo;

        return Promise.all([
            agencyService.getAgency( bolo.agency ),
            userService.getUser( bolo.author )
        ]);
    }).then( function ( responses ) {
        data.agency = responses[0];
        data.author = responses[1];

        return data;
    });
}


function attachmentFilter ( fileDTO ) {
    return /image/i.test( fileDTO.content_type );
}

function renameFile ( dto, newname ) {
    dto.name = newname;
    return dto;
}

function createUUID () {
    return  uuid.v4().replace( /-/g, '' );
}

// list bolos at the root route
router.get( '/bolo', function ( req, res, next ) {
    var page = parseInt( req.query.page ) || 1;
    var limit = config.const.BOLOS_PER_PAGE;
    var skip = ( 1 <= page ) ? ( page - 1 ) * limit : 0;

    var data = {
        'paging': { 'first': 1, 'current': page }
    };

    boloService.getBolos( limit, skip ).then( function ( results ) {
        data.bolos = results.bolos;
        data.paging.last = Math.ceil( results.total / limit );
        res.render( 'bolo-list', data );
    }).catch( function ( error ) {
        next( error );
    });
});

// list archive bolos
router.get( '/bolo/archive', function ( req, res, next ) {
    var page = parseInt( req.query.page ) || 1;
    var limit = config.const.BOLOS_PER_PAGE;
    var skip = ( 1 <= page ) ? ( page - 1 ) * limit : 0;

    var data = {
        'paging': { 'first': 1, 'current': page }
    };

    boloService.getArchiveBolos( limit, skip ).then( function ( results ) {
        data.bolos = results.bolos;
        data.paging.last = Math.ceil( results.total / limit );
        res.render( 'bolo-archive', data );
    }).catch( function ( error ) {
        next( error );
    });
});

// render the bolo create form
router.get( '/bolo/create', function ( req, res ) {
    var data = {
        'form_errors': req.flash( 'form-errors' )
    };

    res.render( 'bolo-create-form', data );
});

// process bolo creation user form input
router.post( '/bolo/create', function ( req, res, next ) {
    parseFormData( req, attachmentFilter ).then( function ( formDTO ) {
        var boloDTO = boloService.formatDTO( formDTO.fields );
        var attDTOs = [];

        boloDTO.createdOn = moment().format( config.const.DATE_FORMAT );
        boloDTO.lastUpdatedOn = boloDTO.createdOn;

        boloDTO.agency = req.user.agency;

        boloDTO.author = req.user.id;
        boloDTO.authorFName = req.user.fname;
        boloDTO.authorLName = req.user.lname;
        boloDTO.authorUName = req.user.username;

        if ( formDTO.fields.featured_image ) {
            var fi = formDTO.fields.featured_image;
            boloDTO.images.featured = fi.name;
            attDTOs.push( renameFile( fi, 'featured' ) );
        }

        if ( formDTO.fields['image_upload[]'] ) {
            formDTO.fields['image_upload[]'].forEach( function ( imgDTO ) {
                var id = createUUID();
                boloDTO.images[id] = imgDTO.name;
                attDTOs.push( renameFile( imgDTO, id ) );
            });
        }

        var result = boloService.createBolo( boloDTO, attDTOs );
        return Promise.all([result, formDTO]);
    }).then( function ( pData ) {
        if ( pData[1].files.length ) cleanTemporaryFiles( pData[1].files );
        sendBoloNotificationEmail( pData[0], 'new-bolo-notification' );
        req.flash( GFMSG, 'BOLO successfully created.' );
        res.redirect( '/bolo' );
    }).catch( function ( error ) {
        next( error );
    });
});


// render the bolo edit form
router.get( '/bolo/edit/:id', function ( req, res, next ) {
    var data = {
        'form_errors': req.flash( 'form-errors' )
    };

    /** @todo car we trust that this is really an id? **/

    getAllBoloData( req.params.id ).then( function ( _data ) {
        _.extend( data, _data );
        var auth = new BoloAuthorize( data.bolo, data.author, req.user );

        if ( auth.authorizedToEdit() ) {
            res.render( 'bolo-edit-form', data );
        }
    }).catch( function ( error ) {
        if ( ! /unauthorized/i.test( error.message ) ) throw error;

        req.flash( GFERR,
            'You do not have permissions to edit this BOLO. Please ' +
            'contact your agency\'s supervisor or administrator ' +
            'for access.'
        );
        res.redirect( 'back' );
    }).catch( function ( error ) {
        next( error );
    });
});

// handle requests to process edits on a specific bolo
router.post( '/bolo/edit/:id', function ( req, res, next ) {
    /** @todo confirm that the request id and field id match **/

    parseFormData( req, attachmentFilter ).then( function ( formDTO ) {
        var boloDTO = boloService.formatDTO( formDTO.fields );
        var attDTOs = [];

        boloDTO.lastUpdatedOn = moment().format( config.const.DATE_FORMAT );

        if ( formDTO.fields.featured_image ) {
            var fi = formDTO.fields.featured_image;
            boloDTO.images.featured = fi.name;
            attDTOs.push( renameFile( fi, 'featured' ) );
        }

        if ( formDTO.fields['image_upload[]'] ) {
            formDTO.fields['image_upload[]'].forEach( function ( imgDTO ) {
                var id = createUUID();
                boloDTO.images[id] = imgDTO.name;
                attDTOs.push( renameFile( imgDTO, id ) );
            });
        }

        if ( formDTO.fields['image_remove[]'] ) {
            boloDTO.images_deleted = formDTO.fields['image_remove[]'];
        }

        var result = boloService.updateBolo( boloDTO, attDTOs );
        return Promise.all( [ result, formDTO ] );
    }).then( function ( pData ) {
        if ( pData[1].files.length ) cleanTemporaryFiles( pData[1].files );
        sendBoloNotificationEmail( pData[0], 'update-bolo-notification' );
        req.flash( GFMSG, 'BOLO successfully updated.' );
        res.redirect( '/bolo' );
    }).catch( function ( error ) {
        next( error );
    });
});


// handle requests to inactivate a specific bolo
router.get( '/bolo/archive/:id', function ( req, res, next ) {
    var data = {};

    getAllBoloData( req.params.id ).then( function ( _data ) {
        _.extend( data, _data );
        var auth = new BoloAuthorize( data.bolo, data.author, req.user );
        if ( auth.authorizedToArchive() ) {
            boloService.activate( data.bolo.id, false );
        }
    }).then( function ( response ) {
        req.flash( GFMSG, 'Successfully archived BOLO.' );
        res.redirect( '/bolo/archive' );
    }).catch( function ( error ) {
        if ( ! /unauthorized/i.test( error.message ) ) throw error;

        req.flash( GFERR,
            'You do not have permissions to archive this BOLO. Please ' +
            'contact your agency\'s supervisor or administrator ' +
            'for access.'
        );
        res.redirect( 'back' );
    }).catch(function ( error ) {
        next( error );
    });
});


/**
 * Process a request to restore a bolo from the archive.
 */
router.get( '/bolo/restore/:id', function ( req, res, next ) {
    var data = {};

    getAllBoloData( req.params.id ).then( function ( _data ) {
        _.extend( data, _data );
        var auth = new BoloAuthorize( data.bolo, data.author, req.user );
        if ( auth.authorizedToArchive() ) {
            boloService.activate( data.bolo.id, true );
        }
    }).then( function ( response ) {
        req.flash( GFMSG, 'Successfully restored BOLO.' );
        res.redirect( '/bolo' );
    }).catch( function ( error ) {
        if ( ! /unauthorized/i.test( error.message ) ) throw error;

        req.flash( GFERR,
            'You do not have permissions to restore this BOLO. Please ' +
            'contact your agency\'s supervisor or administrator ' +
            'for access.'
        );
        res.redirect( 'back' );
    }).catch(function ( error ) {
        next( error );
    });
});


/**
 * Process a request delete a bolo with the provided id
 */
router.get( '/bolo/delete/:id', function ( req, res, next ) {

    getAllBoloData( req.params.id ).then( function ( data ) {
        var auth = new BoloAuthorize( data.bolo, data.author, req.user );
        if ( auth.authorizedToDelete() ) {
            return boloService.removeBolo( req.params.id );
        }
    }).then( function ( response ) {
        req.flash( GFMSG, 'Successfully deleted BOLO.' );
        res.redirect( 'back' );
    }).catch( function ( error ) {
        if ( ! /unauthorized/i.test( error.message ) ) throw error;

        req.flash( GFERR,
            'You do not have permissions to delete this BOLO. Please ' +
            'contact your agency\'s supervisor or administrator ' +
            'for access.'
        );
        res.redirect( 'back' );
    }).catch(function ( error ) {
        next( error );
    });
});


// handle requests to view the details of a bolo
router.get( '/bolo/details/:id', function ( req, res, next ) {
    var data = {};

    boloService.getBolo( req.params.id ).then( function ( bolo ) {
        data.bolo = bolo;
        return agencyService.getAgency( bolo.agency );
    }).then( function ( agency ) {
        data.agency = agency;
        res.render( 'bolo-details', data );
    }).catch( function ( error ) {
        next( error );
    });
});


// handle requests for bolo attachments
function getAttachment ( req, res ) {
    boloService.getAttachment(req.params.boloid, req.params.attname)
        .then(function (attDTO) {
            res.type(attDTO.content_type);
            res.send(attDTO.data);
        });
}
router.get( '/bolo/asset/:boloid/:attname', getAttachment );
router.getAttachment = getAttachment;

module.exports = router;
