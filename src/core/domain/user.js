/* jshint node: true */
'use strict';

if ( undefined === process.env.PASSWORD_SALT ) {
    throw new Error( 'Required environment variable missing: PASSWORD_SALT' );
}

var _       = require('lodash');
var crypto  = require('crypto');
var Entity  = require('./entity');

var SALT = process.env.PASSWORD_SALT;

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
    },
    'agency': {
        'required'  : true,
        'type'      : 'string'
    }
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

/* Reference http://thatextramile.be/blog/2012/01/stop-storing-passwords-already/ */
function hash ( passwd ) {
    return crypto.createHmac( 'sha256', SALT).update( passwd ).digest( 'hex' );
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
    var defaults = {
        'id'            : null,
        'username'      : null,
        'email'         : null,
        'fname'         : '',
        'lname'         : '',
        'password'      : null,
        'tier'          : 1,
        'agency'        : null,
        'badge'         : '',
        'sectunit'      : '',
        'ranktitle'     : '',
        'notifications' : []
    };

    this.data = _.extend( {}, defaults, data );
    Entity.setDataAccessors( this.data, this );
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
 * Chack if the supplied password is equal to the stored password. Will only
 * validate if the stored passwod is hashed.
 *
 * @param {String} - the password to validate
 * @returns {boolean} true if valid, false otherwise
 */
User.prototype.isValidPassword = function ( password ) {
    return this.password === hash( password );
};

/**
 * Hash the password property value. Care should be taken when using this
 * method as there is no way to check if the password is already hashed.
 * Applying this method to an already hashed password could potentially
 * corrupt the user's password if persisted to an external storage device.
 */
User.prototype.hashPassword = function () {
    this.password = hash( this.password );
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
    return Object.getOwnPropertyNames( source.data ).filter( function ( key ) {
        return source.data[key] !== other.data[key];
    });
};

