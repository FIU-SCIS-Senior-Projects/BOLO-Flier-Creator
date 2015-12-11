/* jshint node: true */
'use strict';

var request = require('request');
var Promise = require('promise');
var Container = require('./container');


module.exports = Account;

/**
 * Object Storage Account Class
 *
 * Wrapper class for working with the OpenStack Object Storage API V1
 * @see {@link http://developer.openstack.org/api-ref-objectstorage-v1.html}
 * @class
 * @memberof module:core/lib/ibm-object-storage
 */
function Account ( token ) {
    this.req_opts = function () {
        return {
            url : token.url,
            headers : {
                'Accept' : 'application/json',
                'X-Auth-Token' : token.token
            }
        };
    };
}


/**
 * Get information for the configured account
 *
 * @return {Promise} resolves to an object containing info, rejects otherwise
 */
Account.prototype.info = function () {
    var req_opts = this.req_opts();
    return new Promise( function ( resolve, reject ) {
        request.get( req_opts, function ( err, res, body ) {
            // json responses should only return 200 status codes
            if ( ! err && 200 === res.statusCode ) {
                resolve( JSON.parse( body ) );
            }
            reject( new Error(
                'ibm-object-storage: account info request failed (' +
                res.statusCode + ' http status)'
            ));
        });
    });
};


/**
 * Create the specified container in the configured account
 *
 * @param {String} container - name of the container to create
 * @return {Promise} resolves to true if created, rejects otherwise
 */
Account.prototype.createContainer = function ( container ) {
    var that = this;
    var req_opts = this.req_opts();
    req_opts.url = req_opts.url.concat( '/' + container );

    return new Promise( function ( resolve, reject ) {
        request.put( req_opts, function ( err, res, body ) {
            if ( ! err && ( 201 === res.statusCode || 204 === res.stateCode ) ) {
                resolve( new Container( container, that ) );
            }
            reject( new Error(
                'containerCreate: object storage create failed (' +
                res.statusCode + ' http status)'
            ));
        });
    });
};


/**
 * Check if the confgured account has the sepcified container
 *
 * @param {String} container - container to check for
 * @return {Promise} resolves to true if found and false if not found,
 *                   rejects if errors are encountered
 */
Account.prototype.hasContainer = function ( container ) {
    var req_opts = this.req_opts();
    req_opts.url = req_opts.url.concat( '/' + container );
    req_opts.qp = { limit: 0 };

    return new Promise( function ( resolve, reject ) {
        request.get( req_opts, function ( err, res, body ) {
            // assuming same behavior as GET /account_id
            if ( ! err && 200 === res.statusCode ) {
                resolve( true );
            }
            else if ( ! err && 404 === res.statusCode ) {
                resolve( false );
            }
            reject( new Error(
                'hasContainer: object storage request failed (' +
                res.statusCode + ' http status)'
            ));
        });
    });
};


/**
 * Use the specified container in the configured account
 *
 * @param {String} container - name of the container to use
 * @return {Promise} b
 */
Account.prototype.useContainer = function ( container ) {
    var that = this;
    var req_opts = this.req_opts();
    req_opts.url = req_opts.url.concat( '/' + container );

    return this.hasContainer( container )
        .then( function ( containerFound ) {
            if ( containerFound )
                return Promise.resolve( new Container( container, that ) );
            else
                throw new Error( 'useContainer: container does not exist' );
        });
};

