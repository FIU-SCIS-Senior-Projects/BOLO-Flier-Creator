/* jshint node: true */
var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var lodash = require('lodash');


/*
 * Helpers
 */
var copy = function ( src, dst ) {
    var srcFile = fs.createReadStream( src );
    var dstFile = fs.createWriteStream( dst );
    return new Promise ( function ( fulfill, reject ) {
        var theDest = dst;
        srcFile.pipe( dstFile );
        srcFile.on( 'error', reject );
        dstFile.on( 'error', reject );
        dstFile.on( 'finish', function () {
            fulfill( theDest );
        });
    });
};

var targetPath = function ( name, parts ) {
    return path.join( parts.dir, name + parts.ext );
};


/**
 * FileFactory Implementation
 *
 * @param {String} fp - The **absolute** file path to the source file. Note
 *  that if an aboslute path is not given then the copy path cannot be
 *  guaranteed.
 */
function FileFactory ( fp ) {
    if ( ! path.isAbsolute( fp ) ) {
        throw new Error(
            'Factory template file must be specified by an absolute path.'
        );
    }
    this.src = fp;
    this.parts = path.parse( fp );
    this.created = [];
}

FileFactory.prototype.create = function ( name ) {
    var context = this;
    return copy( this.src, targetPath( name, this.parts ) )
        .then( function ( path ) {
            context.created.push( path );
            return path;
        });

};

FileFactory.prototype.createBulk = function ( names ) {
    var context = this;

    return Promise.all( names.map( function ( name ) {
        return copy( context.src, targetPath( name, context.parts ) )
            .then( function ( path ) {
                context.created.push( path );
                return path;
            });
    }));
};

FileFactory.prototype.shutitdown = function () {
    var context = this;
    var unlink = Promise.denodeify( fs.unlink );

    return Promise.all( context.created.map( function ( path ) {
        return unlink( path );
    }));
};

module.exports = FileFactory;
