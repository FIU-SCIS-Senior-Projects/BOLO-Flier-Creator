/* jshint node: true */
'use strict';

var _ = require('lodash');
var Promise = require('promise');
var User = require('../domain/user');


/** @module core/ports */
module.exports = UserService;


/**
 * Creates a new instance of {UserService}.
 *
 * @class
 * @classdesc Provides an API for interacting with application user
 * interfaces.
 *
 * @param {StrageAdapter|UserRepository} - Oobject implementing the User
 * Repository Storage Port Interface.
 */
function UserService ( userRepository ) {
    this.userRepository = userRepository;
}

/**
 * Authenticate a username and password pair.
 *
 * @param {String} - the username to authenticate
 * @param {String} - the password to authenticate for the supplied username
 *
 * @returns {Promise|User} the User object matching the supplied username and
 * password. Null if authentication fails.
 */
UserService.prototype.authenticate = function ( username, password ) {
    var userPromise = this.userRepository.getByUsername( username );

    return userPromise
    .then( function ( user ) {
        if ( user && user.data.password == password ) {
            return Promise.resolve( user );
        }

        return Promise.resolve( null );
    });
};

/**
 * Deserialize a user id.
 *
 * @param {String} - the User's id to deserialize
 *
 * @returns {Promise|User} the User object matching the supplied id.
 */
UserService.prototype.deserializeId = function ( id ) {
    return this.userRepository.getById( id );
};

/**
 * Get a list of defined user roles.
 *
 * @returns {Array} list of defined user roles.
 */
UserService.prototype.getRoleNames = function () {
    return User.roleNames().map( function ( name ) {
        return _.startCase( name.toLowerCase() );
    });
};

/**
 * Get the index of a user role by name.
 *
 * @param {String} - name of the role to get
 * @returns {number} - the integer value of the role name or undefined.
 */
UserService.prototype.getRole = function ( roleName ) {
    var role = _.snakeCase( roleName ).toUpperCase();
    return User[role];
};

/**
 * Register a new user in the system.
 *
 * @param {Object} - new user information in the expected DTO format
 * @returns {Promise|User} promises a user object for the new user or rejects
 * with an error if the user could not be saved.
 */
UserService.prototype.registerUser = function ( userDTO ) {
    var context = this;
    var newuser = new User( userDTO );

    if ( ! newuser.isValid() ) {
        throw new Error( 'User registration invalid' );
    }

    return context.userRepository.getByUsername( newuser.data.username )
        .then( function ( existingUser ) {
            if ( existingUser ) {
                throw new Error( 'User already registered: ' +
                        existingUser.data.username
                );
            }
            return context.userRepository.insert( newuser );
        });
};
