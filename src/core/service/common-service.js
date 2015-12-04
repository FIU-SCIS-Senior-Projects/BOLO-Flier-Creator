/* jshint node: true */
'use strict';

/* Module Dependencies */
var fs = require('fs');
var Promise = require('promise');


/** @module core/ports */

/**
 * Returns the current datetime.
 */
module.exports.getDateTime = function() {
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDay();

    //Append 0 to all values less than 10;
    hour = (hour < 10 ? "0" : "") + hour;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
};

module.exports.cleanTemporaryFiles = function ( files ) {
    files.forEach( function ( file ) {
        fs.unlink( file.path );
    });
};
