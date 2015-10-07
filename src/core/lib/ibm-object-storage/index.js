/* jshint node: true */
'use strict';


var Promise = require('promise');
var request = require('request');

var Account = require('./account');
var Auth = require('./auth');

/**
 * @module
 * IBM Object Storage Connection Module
 *
 * API References
 * - https://www.ng.bluemix.net/docs/services/ObjectStorage/index.html
 * - http://developer.openstack.org/api-ref-objectstorage-v1.html
 * - https://swiftstack.com/docs/admin/middleware/bulk.html
 */

function isValid ( conf ) {
    return Object.keys( conf )
        .every( function ( val ) { return undefined !== val } )
};


/**
 *  Connect to the configured Object Storage account.
 *
 *  @param {String} account - The account to connect to
 *  @return {Account} An Object Storage account object 
 *
 */
module.exports.connect = function ( account ) {
    var conf = ( process.env.VCAP_SERVICES ) ?
        Auth.configFromBluemix() : Auth.configFromEnvironment();

    if ( ! isValid( conf ) ) {
        return Promise.reject( new Error( 'object storage credentials missing...' ) );
    };

    return Auth.getToken( account, conf )
        .then( function ( token ) {
            return new Account( token );
        })
        .catch( function ( error ) {
            throw new Error( 'IBM Object Store: connect to ' + account + ' failed...' );
        });
};

