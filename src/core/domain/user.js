/* jshint node: true */
'use strict';

var _ = require('lodash');

var schema = {
    'username': {
        'required'  : true,
        'type'      : 'string'
    },
    'email': {
        'required'  : true,
        'type'      : 'string'
    },
    'password': {
        'required'  : true,
        'type'      : 'string'
    },
    'tier': {
        'required'  : true,
        'type'      : 'number'
    }
};

var userTemplate = {
    'id'            : null,
    'username'      : null,
    'email'         : null,
    'fname'         : null,
    'lname'         : null,
    'password'      : null,
    'tier'          : null,
    'agency'        : null,
    'badge'         : null,
    'sectunit'      : null,
    'ranktitle'     : null
};

var required = Object.keys( schema ).filter( function ( key ) {
    return schema[key].required;
});

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
 * Ensure the consistency of user data.
 *
 * @returns {bool} true if passes validation, false oherwise
 *
 * @todo Refactor the validation mechanism. This approach is a naive
 * implementation and should be reviewed. The domain/bolo.js module uses a
 * similar approach that shoud be refactored as well.
 */
User.prototype.isValid = function () {
    var data = this.data;
    var result = required.filter( function ( key ) {
        if ( data[key] && typeof data[key] === schema[key].type )
            return data[key];
    }, []) || [];

    return ( result.length === required.length );
};

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
