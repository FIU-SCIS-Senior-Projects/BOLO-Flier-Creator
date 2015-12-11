/* jshint node: true */
'use strict';


var Promise = require('promise');
var request = require('request');

var Account = require('./account');
var Auth = require('./auth');

/**
 * IBM Object Storage Connection Module
 *
 *  @see {@link https://www.ng.bluemix.net/docs/services/ObjectStorage/index.html}
 *  @see {@link http://developer.openstack.org/api-ref-objectstorage-v1.html}
 *  @see {@link https://swiftstack.com/docs/admin/middleware/bulk.html}
 *
 * @module core/lib/ibm-object-storage
 */

/**
 * Validate a config object.
 * @private
 * @param {Object} - A generated conf object
 */
function isValid ( conf ) {
    return Object.keys( conf )
        .every( function ( val ) { return undefined !== val; } );
}


/**
 *  Connect to the configured Object Storage account.
 *
 *  @param {String} account - The account to connect to
 *  @returns {Promise|Account} An Object Storage account object
 */
exports.connect = function ( account ) {
    var conf = ( process.env.VCAP_SERVICES ) ?
        Auth.configFromBluemix() : Auth.configFromEnvironment();

    if ( ! isValid( conf ) ) {
        return Promise.reject( new Error( 'object storage credentials missing...' ) );
    }

    return Auth.getToken( account, conf )
        .then( function ( token ) {
            return new Account( token );
        })
        .catch( function ( error ) {
            throw new Error( 'IBM Object Store: connect to ' + account + ' failed...' );
        });
};

