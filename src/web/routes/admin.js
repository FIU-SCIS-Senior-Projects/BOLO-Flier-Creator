/* jshint node: true */
'use strict';

var router = require('express').Router();

module.exports = router;

/**
 * GET /createuser
 * Responds with a form to create a new user.
 */
router.get( '/createuser', function ( req, res ) {
    res.render( 'create-user-form' );
});
