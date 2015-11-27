/* jshint node:true */
'use strict';

var path                = require('path');

require('dotenv').config({
    'path': path.resolve( __dirname, '../../.env' )
});

var core                = path.resolve( __dirname, '../core' );
var config              = {};


/* Export the config object */
module.exports          = config;


/* Infrastructure Config */
config.BoloService      = require( path.join( core, 'service/bolo-service') );
config.BoloRepository   = require( path.join( core, 'adapters/persistence/cloudant-bolo-repository' ) );

config.AgencyService    = require( path.join( core, 'service/agency-service') );
config.AgencyRepository = require( path.join( core, 'adapters/persistence/cloudant-agency-repository' ) );

config.UserService      = require( path.join( core, 'service/user-service' ) );
config.UserRepository   = require( path.join( core, 'adapters/persistence/cloudant-user-repository' ) );


/* Application Config */
config.const = config.constants = {
    /* Flash Message Subjects */
    'GFERR'             : 'Flash Subject - Global Error',
    'GFMSG'             : 'Flash Subject - Global Message',

    /* Password Config */
    'MIN_PASS_LENGTH'   : 8
};


