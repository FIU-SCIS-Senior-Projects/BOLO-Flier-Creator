/* jshint node: true */
'use strict';

var _ = require('lodash');
var Entity = require('./entity');

var agencyTemplate = {
    'id'            : '',
    'name'          : '',
    'address'       : '',
    'city'          : '',
    'state'         : '',
    'zip'           : '',
    'phone'         : '',
    'isActive'      : true,
    'attachments'   : {}
};

/** @module core/domain */
module.exports = Agency;

/**
 * Create a new Agency object.
 *
 * @class
 * @classdesc Entity object representing an Agency.
 *
 * @param {Object} data - Object containing Agency Data properties
 */
function Agency(data) {
    this.data = _.extend({}, agencyTemplate, data);
    Entity.setDataAccessors( this.data, this );
}

/**
 * Checks if the agency is valid
 *
 * @returns {bool} true if passes validation, false otherwise
 */
Agency.prototype.isValid = function () {
    // TODO Pending Implementation
    return true;
};

/**
 * Returns an array of keys differing from the source user object.
 *
 * @param {Agency} - the other agency to compare to
 */
Agency.prototype.diff = function ( other ) {
    var source = this;
    return Object.getOwnPropertyNames( source.data )
        .filter( function ( key ) {
            return ! _.isEqual( other.data[key], source.data[key] );
        });
};