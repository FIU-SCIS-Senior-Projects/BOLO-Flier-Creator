/* jshint node:true */
'use strict';

var path = require('path');

var core = path.resolve( __dirname, '../core' );
module.exports.CORE_PATH = core;

/* Infrastructure Config */
module.exports.UserService = require( path.join( core, 'service/user-service' ) );
module.exports.UserRepository = require( path.join( core, 'adapters/persistence/cloudant-user-repository' ) );

/* Application Config */
module.exports.constants = {
    'MIN_PASS_LENGTH'   : 8
};
