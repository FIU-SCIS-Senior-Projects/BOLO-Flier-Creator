/* jshint node: true */
'use strict';

var request = require('request');
var Promise = require('promise');


module.exports = Container;

/**
 * Object Storage Container Class
 *
 * Wrapper class for working with the OpenStack Object Storage API V1
 * @see {@link http://developer.openstack.org/api-ref-objectstorage-v1.html}
 *
 * @class
 * @memberof module:core/lib/ibm-object-storage
 */
function Container ( name, account ) {
    Object.defineProperties( this, { 'name' : { value: name } } );  // read-only
    this.req_opts = function () {
        var base = account.req_opts();
        base.url = base.url.concat( '/', name );
        return Object.create( base );
    };
}


/**
 * Get a list of objects in the configured container.
 *
 * The number of items returned is defaulted to 50 and the max acquirable is
 * limited by the Object Storage server (reference the API documentation).
 *
 * Options Defaults:
 *   limit: 50
 *
 * @param {Object} options - paging options
 * @return {Promise} resolves to array of json objects, rejects on errors
 */
Container.prototype.list = function ( options ) {
    var opts = options || {};
    var qp = { limit: 50 };
    if ( opts.limit )   qp.limit = parseInt( opts.limit );
    if ( opts.marker )  qp.marker = opts.marker;
    var req_opts = this.req_opts( qp );

    return new Promise( function ( resolve, reject ) {
        request.get( req_opts, function ( err, res, body ) {
            if ( ! err && ( 200 === res.statusCode || 204 === res.stateCode ) ) {
                resolve( JSON.parse( body ) );
            }

            reject( new Error(
                'object-storage-container: unknown error (' +
                res.statusCode + ' status code)'
            ));
        });
    });
};


/**
 * Create an object in the configured account and container
 *
 * @param {String} name - name of the object to store
 * @param {ReadableStream} stream - the object to store
 * @param {String} filename - optional filename to store
 * @return {Promise} resolves to response headers if created, rejects otherwise
 */
Container.prototype.createObject = function ( name, stream, filename ) {
    var req_opts = this.req_opts();
    req_opts.url = req_opts.url.concat( '/', name );
    req_opts.qp = { filename: filename || name };

    return new Promise( function ( resolve, reject ) {
        stream.pipe( request.put( req_opts, function ( err, res, body ) {
            if ( ! err && 201 === res.statusCode ) {
                resolve( res.headers );
            }

            var code = ( ( res ) ? res.statusCode : 0 ) || 0;
            reject( new Error(
                'object-storage-container: failed to create object (' +
                code + ' status code)'
            ));
        }));
    });
};




