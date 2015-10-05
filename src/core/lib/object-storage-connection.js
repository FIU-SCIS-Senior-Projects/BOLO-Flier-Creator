/* jshint node: true */
'use strict';

var request = require('request');
var Promise = require('promise');
var url = require('url');
var _ = require('lodash');

require('dotenv').config({ path: __dirname + '/../../../.env' });

/**
 * @module
 * IBM Object Storage Connection Module
 *
 * API References
 * - https://www.ng.bluemix.net/docs/services/ObjectStorage/index.html
 * - http://developer.openstack.org/api-ref-objectstorage-v1.html
 * - https://swiftstack.com/docs/admin/middleware/bulk.html
 */

var conf, cache;

var MAX_BULK = 10000;

/* Default Object Storage Account and Container if not provided */
var defaults = {
    account     : 'app',
    container   : 'uploads'
};


/*
 * Application specific configuration for IBM Object Storage
 */
function configure () {
    var credentials;
    var services;

    if ( process.env.VCAP_SERVICES ) {
        services = JSON.parse( process.env.VCAP_SERVICES || '{}' );
        credentials = services.objectstorage[0].credentials;
    } else {
        credentials = {
            auth_uri : process.env.OSTORE_AUTH_URI,
            username : process.env.OSTORE_AUTH_UN,
            password : process.env.OSTORE_AUTH_PW
        };
    }

    conf = {
        auth_uri    : credentials.auth_uri,
        userid      : credentials.username,
        password    : credentials.password,
        account     : process.env.OSTORE_BOLO_ACCT || defaults.account,
        container   : process.env.OSTORE_BOLO_CONT || defaults.container
    };
    conf.secret = "Basic " +
        new Buffer(conf.userid + ":" + conf.password).toString("base64");
}


/*
 * Get a token for the IBM OBject Storage API for the application's
 * Object Storage account.
 */
function getToken () {
    if ( cache ) Promise.resolve( cache );

    if ( ! conf ) configure();
    var req_options = {
        url : conf.auth_uri + '/' + conf.account,
        headers : {
            'accept' : 'application/json',
            'Authorization': conf.secret
        }
    };

    return new Promise( function ( resolve, reject ) {
        request.get( req_options, function ( err, res, body ) {
            if ( ! err && ( 200 === res.statusCode ) ) {
                resolve( res );
            }
            reject( err );
        });
    })
    .then( function ( response ) {
        cache = {
            token : response.headers['x-auth-token'],
            url : response.headers['x-storage-url'],
            ts : Date.now()
        };
        return response.headers;
    });
}


/**
 * Get information for the configured account
 *
 * @return {Promise} resolves to an object containing info, rejects otherwise
 */
function accountInfo () {
    var req_options = {
        url : cache.url,
        headers : {
            'Accept' : 'application/json',
            'X-Auth-Token' : cache.token
        }
    };

    return new Promise( function ( resolve, reject ) {
        request.get( req_options, function ( err, res, body ) {
            if ( ! err && ( 200 === res.statusCode || 204 === res.stateCode ) ) {
                resolve( JSON.parse( body ) );
            }

            reject( err );
        });
    });
}


/**
 * Check if the confgured account has the sepcified container
 *
 * @param {String} container - container to check for
 * @return {Promise} resolves to true if found and false if not found, rejects
 *                   if errors are encountered
 */
function hasContainer ( container ) {
    var req_options = {
        url : cache.url + '/' + container,
        qp : { limit : 0 },
        headers : {
            'Accept' : 'application/json',
            'X-Auth-Token' : cache.token
        }
    };

    return new Promise( function ( resolve, reject ) {
        request.get( req_options, function ( err, res, body ) {
            if ( ! err && ( 200 === res.statusCode || 204 === res.stateCode ) ) {
                resolve( true );
            }
            else if ( ! err && 404 == res.statusCode ) {
                resolve( false );
            }

            reject(
                new Error( 'hasContainer: object storage request failed' )
            );
        });
    });
}


/**
 * Create the specified container in the configured account
 *
 * @param {String} container - name of the container to create
 * @return {Promise} resolves to true if created, rejects otherwise
 */
function containerCreate ( container ) {
    var req_options = {
        url : cache.url + '/' + container,
        headers : {
            'Accept' : 'application/json',
            'X-Auth-Token' : cache.token
        }
    };

    return new Promise( function ( resolve, reject ) {
        request.put( req_options, function ( err, res, body ) {
            if ( ! err && ( 200 === res.statusCode || 204 === res.stateCode ) ) {
                resolve( true );
            }

            reject(
                new Error( 'containerCreate: object storage create failed' )
            );
        });
    });
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
function containerList ( options ) {
    var opts = options || {};

    var qp = { limit: 50 };
    if ( opts.limit )   qp.limit = parseInt( opts.limit );
    if ( opts.marker )  qp.marker = opts.marker;

    var req_options = {
        url : cache.url + '/' + conf.container,
        qp: qp,
        headers : {
            'Accept' : 'application/json',
            'X-Auth-Token' : cache.token
        }
    };

    return new Promise( function ( resolve, reject ) {
        request.get( req_options, function ( err, res, body ) {
            if ( ! err && ( 200 === res.statusCode || 204 === res.stateCode ) ) {
                resolve( JSON.parse( body ) );
            }

            reject( new Error( 'containerList: object storage lising failed' ) );
        });
    });
}


/*
 * Super secret undocumented method.
 *
 * **WARNING**
 * This will bulk delete every object from the container specified in the
 * conf object.
 *
 * @param {boolean} confirm - confirm that you want to do this operation
 * @return {Object} resolves to the number of deleted objects,
 *                  rejects if there was an issue
 */
function containerDeleteAll ( confirm ) {
    if ( ! confirm )
        return Promise.reject( new Error( 'bulk delete not confirmed' ) );

    var list_qty, files;
    var filter = function ( entry ) {
        return conf.container + "/" + entry.name;
    };

    return containerList( { limit: MAX_BULK } )
        .then( function ( list ) {
            list_qty = list.length;
            files = list.map( filter ).join( "\n" );
            return bulkDelete( files );
        })
        .then( function ( result ) {
            var num = parseInt( result["Number Deleted"] );
            if ( num != list_qty || num == MAX_BULK )
                return Promise.resolve( num + containerDeleteAll( true ) );
            else
                return Promise.resolve( num );
        });
}

function bulkDelete ( files ) {
    if ( ! files.length ) {
        return { "Number Deleted" : 0 };
    }
    return new Promise( function ( resolve, reject ) {
        request.del({
            url : cache.url + "?bulk-delete",
            headers : {
                'Accept' : 'application/json',
                'X-Auth-Token' : cache.token,
                'Content-Type' : 'text/plain'
            },
            body : files
        }, function ( err, res, body ) {
            if ( ! err && 200 === res.statusCode ) {
                resolve( JSON.parse( body ) );
            }
            reject( err );
        });
    });
}


/**
 * Create an object in the configured account and container
 *
 * @param {String} name - name of the object to store
 * @param {ReadableStream} stream - the object to store
 * @param {String} filename - optional filename to store
 * @return {Promise} resolves to response headers if created, rejects otherwise
 */
function objectCreate ( name, stream, filename ) {
    var req_options = {
        url : cache.url + '/' + conf.container + '/' + name,
        qp : { filename: filename || name },
        headers : {
            'Accept' : 'application/json',
            'X-Auth-Token' : cache.token
        }
    };

    return new Promise( function ( resolve, reject ) {
        stream.pipe(
            request.put( req_options, function ( err, res, body ) {
                if ( ! err && 201 === res.statusCode ) {
                    resolve( res.headers );
                }

                reject(
                    new Error( 'objectCreate: object storage create failed' )
                );
            })
        );
    });
}



/*
 * Module Initialization
 *
 *   1) Attempt to get an account token
 *   2) Check if the required container exists
 *   3) Create the container if it doesn't exist
 *
 * Throws an error if configuration fails
 */
function moduleInit () {
    if ( cache ) return Promise.resolve( true );

    return getToken()
        .then( function ( value ) {
            return hasContainer( conf.container );
        })
        .then( function ( exists ) {
            if ( exists ) return Promise.resolve( true );
            return containerCreate( conf.container );
        })
        .catch( function ( err ) {
            throw err;
        });
}

/* Attempt to initialize right away */
moduleInit();


/*
 * Reveal Module Methods
 */
module.exports = ( function () {
    return {
        init            : moduleInit,
        refreshToken    : getToken,
        containerList   : containerList,
        objectCreate    : objectCreate,
        _cbd            : containerDeleteAll
    };
})();

