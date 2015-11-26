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
    'tier'          : 1,
    'agency'        : null,
    'badge'         : null,
    'sectunit'      : null,
    'ranktitle'     : null
};

var required = Object.keys( schema ).filter( function ( key ) {
    return schema[key].required;
});


var EnumRoles = Object.create( null, {
    'OFFICER'       : { 'value': 1, 'writable': false, 'enumerable': true },
    'SUPERVISOR'    : { 'value': 2, 'writable': false, 'enumerable': true },
    'ADMINISTRATOR' : { 'value': 3, 'writable': false, 'enumerable': true }
});

for ( var role in EnumRoles ) {
    Object.defineProperty( User, role, {
        'value': EnumRoles[role], 'writable': false, 'enumerable': true
    });
}


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

    // set some getters and setter on the main object instead of having to
    // access properties via the .data object
    var context = this;
    Object.keys( this.data ).forEach( function ( key ) {
        Object.defineProperty( context, key, {
            get: function () { return context.data[key]; },
            set: function ( v ) { context.data[key] = v; }
        });
    });
}

/**
 * Get the role name by providing the tier value.
 * @private
 */
function getRoleByValue ( value ) {
    return _.findKey( EnumRoles, function ( role ) {
        return ( role === value );
    });
}

/**
 * Returns a string array of defined roles.
 * @returns {String|Array} array of defined roles as strings
 *
 */
User.roleNames = function () {
    return Object.keys( EnumRoles );
};

/**
 * Get the role name of the current user.
 * @returns {String} role name of this object
 */
User.prototype.roleName = function () {
    return getRoleByValue( this.tier );
};

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
        return ( data[key] && typeof data[key] === schema[key].type );
    });

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

