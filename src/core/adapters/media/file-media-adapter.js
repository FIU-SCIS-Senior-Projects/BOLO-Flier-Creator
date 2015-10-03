/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var Promise = require('promise');


/*
 * Utility and Wrapper Methods
 */

/* Denodeify so we can use promises */
var write = Promise.denodeify( fs.writeFile );
var rename = Promise.denodeify( fs.rename );

/**
 * Move a file to the system configured uploads directory.
 *
 * @param {String} filePath - Path to the file to move
 */
var moveFile = function ( filePath ) {
    var srcFile = path.basename( filePath );

    var uploadUUID = uuid.v4(),  // v1 may cause conflicts in multi uploads
        uploadPath = process.env.FILE_STORAGE_PATH,
        uploadFile = uploadUUID + path.extname( srcFile ),
        uploadMeta = { uuid : uploadUUID, filename : srcFile };

    var metaString = JSON.stringify( uploadMeta );

    var uploadFilePromise = rename(
            filePath, path.join( uploadPath, uploadFile )
    );

    var writeMetaPromise = write(
            path.join( uploadPath, uploadUUID + '.json' ), metaString
    );

    return writeMetaPromise
            .then( function ( val ) {
                return uploadFilePromise;
            })
            .then( function ( val ) {
                return Promise.resolve( uploadMeta );
            });
            /* Note:
             * Prmoise#then has a default onReject handler
             * http://promisejs.org/api#Promise_prototype_then
             */
};


/**
 * @constructor
 * FileMediaAdapter class constructor
 *
 * Implements the expected interface for a Media Port.
 */
var FileMediaAdapter = function () {};


/**
 * FileMediaAdapter#put
 * Asynchronous method for uploading an image to the specified filesystem
 * path.
 *
 * @param {Array} filePathsArray - An array of file paths to upload
 * @return {Promise} Promise of an array with UUID of each file uploaded.
 */
FileMediaAdapter.prototype.put = function ( filePathsArray ) {
    if ( ! filePathsArray || 0 === filePathsArray.length )
        return Promise.resolve( [] );
    else
        return Promise.all( filePathsArray.map( moveFile ) );
};

module.exports = FileMediaAdapter;
