/* jshint node:true */
'use strict';

var router          = require('express').Router();

var config          = require('../config.js');

var userService     = new config.UserService( new config.UserRepository() );


module.exports = router;

router.get( '/', function ( req, res ) {
    res.locals.account_nav = 'account-home';

    var data = {
        'user': req.user
    };

    res.render( 'account-details', data );
});
