/* jshint node: true, -W069 */
'use strict';

var _ = require('lodash');
var Promise = require('promise');
var request = require('request');


var Auth = {};

/**
 * Return a Basic Auth string from the supplied username and password.
 *
 * @private
 * @param {String} - username to include in the auth string
 * @param {String} - password to include in the auth string
 */
var basic_auth = function ( username, password ) {
    return 'Basic ' +
        new Buffer( username + ':' + password ).toString( 'base64' );
};


/**
 * Get an immutable config object.
 *
 * @param {Object} credentials - credentials for the object storage service
 */
Auth.config = function ( credentials ) {
    var conf = {};
    var setReadOnly = _.partial( Object.defineProperty, conf );
    var secret = basic_auth( credentials.username, credentials.password );

    setReadOnly( 'auth_uri', { value: credentials.auth_uri, enumerable: true } );
    setReadOnly( 'username', { value: credentials.username, enumerable: true } );
    setReadOnly( 'password', { value: credentials.password, enumerable: true } );
    setReadOnly( 'secret',   { value: secret, enumerable: true } );

    return conf;
};


/**
 * Helper method to get Object Storage credentials from Bluemix. Assumes
 * an instance of Object Storage V1 is binded to the running instance.
 */
Auth.configFromBluemix = function () {
    var services = JSON.parse( process.env.VCAP_SERVICES || '{}' );
    var credentials = services.objectstorage[0].credentials || {};
    return this.config( credentials );
};


/**
 * Helper method to get Object Storage credentials from environment
 * variables accesible via global `process.env` object.
 */
Auth.configFromEnvironment = function () {
    return this.config({
        auth_uri : process.env.OSTORE_AUTH_URI,
        username : process.env.OSTORE_AUTH_UN,
        password : process.env.OSTORE_AUTH_PW
    });
};


/**
 * Get a token for the IBM OBject Storage API for the application's
 * Object Storage account.
 *
 * @param {String} - Account name to get a token for.
 * @param {Object} - Object containing Object Storage credentials.
 */
Auth.getToken = function ( account, conf ) {
    var _this = this;
    return new Promise( function ( resolve, reject ) {
        request.get({
            url : conf.auth_uri + '/' + account,
            headers : {
                'Accept' : 'application/json',
                'Authorization': conf.secret
            }
        }, function ( err, res, body ) {
            if ( ! err && 200 === res.statusCode ) {
                resolve( _this.buildToken ( res.headers ) );
            }
            reject( new Error(
                'object-storage-auth: error getting account token (' +
                res.statusCode + ' status code)'
            ));
        });
    });
};


/**
 * Extract token data from a .getToken response header object
 *
 * @param {Object} response - http response header object from .getToken
 * @return {Object} object with the token, url, and timestamp (ts)
 */
Auth.buildToken = function ( response ) {
    return Object.create( {}, {
        url : { value: response['x-storage-url'], enumerable: true },
        token : { value: response['x-auth-token'], enumerable: true },
        ts : { value: response['date'] || new Date().toUTCString(), enumerable: true }
    });
};


/** @module core/lib/ibm-object-storage */
module.exports = Auth;
