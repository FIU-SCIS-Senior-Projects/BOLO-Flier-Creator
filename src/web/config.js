/* jshint node:true */
'use strict';

var path                = require('path');
var validate            = require('validate.js');

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

config.EmailService     = require( path.join( core, 'adapters/email/sendgrid-email-service' ) );
config.CommonService    = require( path.join( core, 'service/common-service' ) );


/* Application Config */
config.appURL           = process.env.APP_URL || 'http://localhost:3000';

config.const = config.constants = {
    /* Flash Message Subjects */
    'GFERR'             : 'Flash Subject - Global Error',
    'GFMSG'             : 'Flash Subject - Global Message',

    /* http://momentjs.com/docs/#/displaying/ */
    'DATE_FORMAT'       : 'MM-DD-YY HH:mm:ss'
};

/**
 * This configuration is a good candidate for a system admin controlled
 * system configuation property.
 *
 * @todo Extract this into system configuration page accesible by a system
 * administrator (but not an agency administrator)
 */
config.email = {
    'from'              : 'bolo.flyer@gmail.com',
    'fromName'          : 'BOLO Flier Creator',

    'template_path'     : path.resolve( __dirname, './views/email' )
};


/**
 * Validation Policy
 *
 * @see http://validatejs.org#validators for documentation detailing the list
 * of pre-defined validators or how to create custom validators
 */

config.validation = {
    'password' : {
        presence : true,
        /* https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Proper_Password_Strength_Controls */
        length : {
            minimum : 10,
            maximum : 128
        },
        /* https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository
         * 10 to 128 character password requiring at least 3 out 4 (uppercase
         * and lowercase letters, numbers and special characters) and no more
         * than 2 equal characters in a row
         * Symbols: ! ~ < > , ; : _ = ? * + # . " & § % ° ( ) | [ ] - $ ^ @ /
         */
        format : {
            pattern : /^(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))(?!.*(.)\1{2,})[A-Za-z0-9!~<>,;:_=?*+#."&§%°()\|\[\]\-\$\^\@\/]{10,128}$/,
            message : ' must contain at least 3 out of 4 (uppercase and ' +
                'lowercase letters, numbers and special characters) and no ' +
                'more than 2 equal characters in a row. Valid special ' +
                'characters: ! ~ < > , ; : _ = ? * + # . " & § % ° ( ) | [ ' +
                '] - $ ^ @ /'
        }
    }
};

