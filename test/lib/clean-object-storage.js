/* jshint node: true */
'use strict';

var path = require('path');

var lib = path.resolve( __dirname, '../../src/core/lib' );
var OStore = require( path.join( lib, 'ibm-object-storage' ) );
var Bulk = require( path.join( lib, 'ibm-object-storage/bulk' ) );

/*
 * Command line utility to clear an Object Storage Container
 */


/* remove `node` and path to this script */
var args = process.argv.slice( 2 );


if ( args.length != 2 || args[0] === '-h' || args[0] === '--help' ) print_usage();

var accountName = args[0];
var containerName = args[1];
var listOption = args[2];
var osAccount, osContainer;

require('dotenv').config({ path: path.resolve( __dirname, '../../.env' ) });
checkCredentials();
console.log(
    'Requesting account {', accountName, '} ' +
    'for container {', containerName, '}'
);

OStore.connect( accountName )
.then(
    function ( _account ) {
        console.log( 'Connected to account: ', accountName );
        osAccount = _account;
        return osAccount.info();
    },
    function ( _error ) {
        console.error( 'Unable to connect to the account: ' + accountName );
        process.exit( 1 );
    }
)
.then(
    function ( _list ) {
        console.log( 'Account Info: \n', _list );
        return osAccount.useContainer( containerName );
    },
    function ( _error ) {
        console.error( 'Unable to connect to the account: ' + accountName );
        process.exit( 1 );
    }
)
.then(
    function ( _container ) {
        console.log( 'Found container: ', _container.name );
        osContainer = _container;
        return Bulk.deleteAll( osContainer, true );
    },
    function ( _error ) {
        console.error( 'The container does not exist: ' + containerName );
        process.exit( 1 );
    }
)
.then(
    function ( _num ) {
        console.log( 'Successfully deleted ', _num, ' objects.' );
        process.exit( 0 );
    },
    function ( _error ) {
        console.error( 'The bulk delete operation failed.' );
        console.error( _error );
        process.exit( 1 );
    }
);


/*
 * Print command line program usage
 */
function print_usage () {
    console.log( "Usage: command <account_name> <container_name>" );
    process.exit( 1 );
}


/*
 * Make sure the credentials exist
 */
function checkCredentials () {

    var keys = ['OSTORE_AUTH_URI', 'OSTORE_AUTH_UN', 'OSTORE_AUTH_PW'];
    var okay = keys.every( function ( key ) { return process.env[key]; });

    if ( ! okay ) {
        console.log( 'Failed to find required environment variables', keys );
        process.exit( 1 );
    }
}
