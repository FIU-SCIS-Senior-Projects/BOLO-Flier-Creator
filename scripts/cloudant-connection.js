/* jshint node: true */
'use strict';

var cloudant = require('cloudant');

/* Assume default credentials using dotenv */
var dbCredentials = {
    "host"      : process.env.CLOUDANT_HOST,
    "port"      : process.env.CLOUDANT_PORT,
    "user"      : process.env.CLOUDANT_USER,
    "password"  : process.env.CLOUDANT_PASS,
    "url"       : process.env.CLOUDANT_URL
};

/* Check for Cloudant Credentials in Bluemix VCAP_SERVICES */
if ( process.env.VCAP_SERVICES ) {
    var vcapServices = JSON.parse( process.env.VCAP_SERVICES );

    if ( vcapServices && vcapServices.cloudantNoSQLDB ) {
        var vcapcreds = vcapServices.cloudantNoSQLDB[0].credentials;
        dbCredentials.host = vcapcreds.host;
        dbCredentials.port = vcapcreds.port;
        dbCredentials.user = vcapcreds.username;
        dbCredentials.password = vcapcreds.password;
        dbCredentials.url = vcapcreds.url;
    }
}

Object.keys( dbCredentials ).forEach( function ( key ) {
    if ( ! dbCredentials[key] ) {
        throw new Error( 'Database credentials not found.' );
    }
});

var callback = function ( error, cloudant ) {
    if ( error ) throw error;
};

module.exports = cloudant( dbCredentials, callback );

