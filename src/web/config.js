/* jshint node:true */
'use strict';

var path = require('path');

var core = path.resolve( __dirname, '../core' );
module.exports.CORE_PATH = core;

/* Infrastructure Config */
module.exports.UserService = require( path.join( core, 'service/user-service' ) );
module.exports.UserRepository = require( path.join( core, 'adapters/persistence/cloudant-user-repository' ) );

/* Application Config */
module.exports.const = module.exports.constants = {
    /* Flash Message Subjects */
    'GFERR'             : 'Flash Subject - Global Error',
    'GFMSG'             : 'Flash Subject - Global Message',

    /* Password Config */
    'MIN_PASS_LENGTH'   : 8
};
