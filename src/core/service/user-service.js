/* jshint node: true */
'use strict';

var Promise = require('promise');


/** @module core/ports */
module.exports = UserServicePort;


/**
 * Creates a new instance of {UserServicePort}.
 *
 * @class
 * @classdesc Provides an API for interacting with application user
 * interfaces.
 *
 * @param {StrageAdapter|UserRepository} - Oobject implementing the User
 * Repository Storage Port Interface.
 */
function UserServicePort ( userRepository ) {
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
UserServicePort.prototype.authenticate = function ( username, password ) {
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
UserServicePort.prototype.deserializeId = function ( id ) {
    return this.userRepository.getById( id );
};
