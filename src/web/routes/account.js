/* jshint node:true */
'use strict';

var router          = require('express').Router();

var config          = require('../config.js');

var userService     = new config.UserService( new config.UserRepository() );


var FERR            = 'Flash Subject - Error';
var FMSG            = 'Flash Subject - Message';


module.exports = router;

router.get( '/', function ( req, res ) {
    var data = {
        'account_nav': 'account-home',
        'user': req.user
    };
    res.render( 'account-details', data );
});

router.get( '/password', function ( req, res ) {
    var data = {
        'account_nav': 'account-password',
        'msg': req.flash( FMSG ),
        'err': req.flash( FERR )
    };
    res.render( 'account-password', data );
});
