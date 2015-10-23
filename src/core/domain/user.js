/* jshint node: true */
'use strict';

var _ = require('lodash');

var userTemplate = {
    'id'            : null,
    'username'      : null,
    'password'      : null,
    'fname'         : null,
    'lname'         : null,
    'agency'        : null,
    'tier'          : null
};

/** @module core/domain */
module.exports = User;

/**
 * Create a new User object
 *
 * @class
 * @classdesc Entity object representing a User
 *
 * @param {Object} - Object containing User Data properties.
 */
function User ( data ) {
    this.data = _.extend( {}, userTemplate, data );
}

/**
 * Check if the supplied user object has the same attributes.
 *
 */
User.prototype.same = function ( other ) {
    return 0 === this.diff( other ).length;
};

/**
 * Returns an array keys differing from the source user object.
 *
 * @param {User} - the other user to comapare to
 */
User.prototype.diff = function ( other ) {
    var source = this;
    return Object.getOwnPropertyNames( source.data )
        .filter( function ( key ) {
            return source.data[key] !== other.data[key];
        });
};
