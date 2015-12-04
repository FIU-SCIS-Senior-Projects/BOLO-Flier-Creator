/* jshint node: true */
'use strict';

var jade            = require('jade');
var moment          = require('moment');
var Promise         = require('promise');
var router          = require('express').Router();
var util            = require('util');

var config          = require('../config');
var userService     = new config.UserService( new config.UserRepository() );
var boloService     = new config.BoloService( new config.BoloRepository() );
var emailService    = config.EmailService;

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

// list bolos at the root route
router.get('/bolo', function (req, res) {
    var pageSize = 2;
    var currentPage = req.query.page || 1;

    boloService.getBolos(pageSize, currentPage)
        .then(function (result) {
            res.render('bolo-list', {
                bolos: result.bolos,
                paging: {
                    pages: result.pages,
                    currentPage: currentPage
                }
            });
        });
});

// list archive bolos
router.get('/bolo/archive', function (req, res) {
    var pageSize = 2;
    var currentPage = req.query.page || 1;

    boloService.getArchiveBolos(pageSize, currentPage)
        .then(function (result) {
            res.render('bolo-archive', {
                bolos: result.bolos,
                paging: {
                    pages: result.pages,
                    currentPage: currentPage
                }
            });
        });
});

// render the bolo create form
router.get('/bolo/create', function (req, res) {
    var data = {
        'form_errors': req.flash( 'form-errors' )
    };
    res.render( 'bolo-create-form', data );
});

// process bolo creation user form input
router.post( '/bolo/create', function ( req, res ) {
    parseFormData(req).then(function ( formDTO ) {
        var boloDTO = boloService.formatDTO( formDTO.fields );

        boloDTO.createdOn = moment().format( config.const.DATE_FORMAT );
        boloDTO.lastUpdatedOn = boloDTO.createdOn;
        boloDTO.author = req.user.id;
        boloDTO.agency = req.user.agency;

        boloDTO.authorFName = req.user.fname;
        boloDTO.authorLName = req.user.lname;
        boloDTO.authorUName = req.user.username;

        var atts = formDTO.files.filter( function ( file ) {
            var test = file.content_type && /image/.test( file.content_type );
            console.log( test, ' -- ', file );
            return test;
        });

        var result = boloService.createBolo( boloDTO, atts );
        return Promise.all([result, formDTO]);
    })
    .then(function ( pData ) {
        if ( pData[1].files.length ) cleanTemporaryFiles( pData[1].files );
        sendBoloNotificationEmail( pData[0], 'new-bolo-notification' );
        req.flash( GFMSG, 'BOLO successfully created.' );
        res.redirect( '/bolo' );
    })
    .catch(function ( error ) {
        console.error( 'Error at %s >>> %s', req.originalUrl, error.message );
        req.flash( GFERR, 'Internal server error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

// render the bolo edit form
router.get('/bolo/edit/:id', function (req, res) {
    var data = {
        'form_errors': req.flash( 'form-errors' )
    };

    /** @todo do we trust that this is really an id? **/

    boloService.getBolo( req.params.id ).then( function ( bolo ) {
        data.bolo = bolo;
        res.render( 'bolo-edit-form', data );
    })
    .catch( function ( error ) {
        console.error( 'Error at %s >>> %s', req.originalUrl, error.message );
        req.flash( GFERR, 'Internal server error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

// handle requests to process edits on a specific bolo
router.post( '/bolo/edit/:id', function ( req, res ) {
    parseFormData( req ).then( function ( formDTO ) {
        var boloDTO = boloService.formatDTO( formDTO.fields );
        boloDTO.lastUpdatedOn = moment().format( config.const.DATE_FORMAT );

        var atts = formDTO.files.filter( function ( file ) {
            return file.content_type && /image/.test( file.content_type );
        });

        var result = boloService.updateBolo( boloDTO, formDTO.files );
        return Promise.all( [ result, formDTO ] );
    })
    .then( function ( pData ) {
        if ( pData[1].files.length ) cleanTemporaryFiles( pData[1].files );
        sendBoloNotificationEmail( pData[0], 'update-bolo-notification' );
        req.flash( GFMSG, 'BOLO successfully updated.' );
        res.redirect( '/bolo' );
    })
    .catch(function ( error ) {
        console.error( 'Error at %s >>> %s', req.originalUrl, error.message );
        req.flash( GFERR, 'Internal server error occurred, please try again.' );
        res.redirect( 'back' );
    });
});

// handle requests to inactivate a specific bolo
router.post('/bolo/archive/:id', function (req, res) {
    var activate = false;

    boloService.activate(req.params.id, activate)
        .then(function (success) {
            if (!success) {
                throw new Error("Bolo not inactivated. Please try again.");
            }
            res.redirect('/bolo');
        })
        .catch(function (_error) {
            /** @todo redirect and send flash message with error */
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

/**
 * Process a request to restore a bolo from the archive.
 */
router.post('/bolo/restore/:id', function (req, res) {
    var activate = true;

    boloService.activate(req.params.id, activate)
        .then(function (success) {
            if (!success) {
                throw new Error("Bolo not activated. Please try again.");
            }
            res.redirect('/bolo/archive');
        })
        .catch(function (_error) {
            /** @todo redirect and send flash message with error */
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

/**
 * Process a request delete a bolo with the provided id
 */
router.post('/bolo/delete/:id', function (req, res) {
    boloService.removeBolo(req.params.id)
        .then(function (success) {
            if (!success) {
                throw new Error("Bolo not deleted. Please try again.");
            }
            res.redirect('/bolo');
        })
        .catch(function (_error) {
            // @todo redirect and send flash message with error 
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

// handle requests to view the details of a bolo
router.get('/bolo/details/:id', function (req, res) {
    boloService.getBolo(req.params.id)
        .then(function (bolo) {
            res.render('bolo-details', {
                bolo: bolo
            });
        })
        .catch(function (_error) {
            res.status(500).send('something wrong happened...', _error.stack);
        });
});

// handle requests for bolo attachments
router.get('/bolo/asset/:boloid/:attname', function (req, res) {
    boloService.getAttachment(req.params.boloid, req.params.attname)
        .then(function (attDTO) {
            res.type(attDTO.content_type);
            res.send(attDTO.data);
        });
});

module.exports = router;
