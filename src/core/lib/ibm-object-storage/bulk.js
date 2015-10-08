var request = require('request');

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
var MAX_BULK = 10000;
module.exports.deleteAll = function ( container, confirm ) {
    if ( ! confirm )
        return Promise.reject( new Error( 'bulk delete not confirmed...' ) );

    var list_qty, files;
    var that = this;

    var filter = function ( entry ) {
        return container.name + "/" + entry.name;
    };

    return container.list( { limit: MAX_BULK } )
        .then( function ( list ) {
            list_qty = list.length;
            files = list.map( filter ).join( "\n" );
            return bulkDelete( files, container );
        })
        .then( function ( result ) {
            var num = parseInt( result["Number Deleted"] );
            if ( num != list_qty || num == MAX_BULK )
                return Promise.resolve( num + that._clearContainer( true ) );
            else
                return Promise.resolve( num );
        });
};

function bulkDelete ( files, context ) {
    if ( ! files.length ) {
        return { "Number Deleted" : 0 };
    }
    var req_opts = context.req_opts();
    return new Promise( function ( resolve, reject ) {
        request.del({
            url : req_opts.url + "?bulk-delete",
            headers : {
                'Accept' : 'application/json',
                'X-Auth-Token' : req_opts.headers['X-Auth-Token'],
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