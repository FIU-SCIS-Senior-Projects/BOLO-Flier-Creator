/* jshint node: true, mocha: true, expr: true */
'use strict';

/*
 * BOLO Domain Entity
 *
 */

var schema = {
    authorFName     : { required: true, type: 'string' },
    authorLName     : { required: true, type: 'string' },
    authorUName     : { required: true, type: 'string' },
    agency          : { required: true, type: 'string' }
};

var required = Object.keys( schema ).filter( function ( key ) {
    return schema[key].required;
});


/**
 * Bolo constructor
 *
 * @constructor
 * @param {Object} data - Object containing the Bolo Data
 *
 */
function Bolo ( data ) {
    this.data = data;
}

/**
 * Checks if the bolo is valid
 */
Bolo.prototype.isValid = function () {
    // TODO Naive validation implementation, refactor using a robust validation
    // library like Joi. It might be useful to implement validation with a
    // Bolo Template object
    var data = this.data;
    var result = required.reduce( function ( reqs, key ) {
        if ( data[key] && typeof data[key] === schema[key].type )
            return reqs.concat( key );
    }, [] ) || [];
    // if all required keys were pushed, then valid
    return ( result.length === required.length );
};

module.exports = Bolo;
