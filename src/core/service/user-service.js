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
    return this.userRepository.getByUsername( username )
    .then( function ( user ) {
        if ( user && user.isValidPassword( password ) ) {
            return user;
        }
        return null;
    })
    .catch( function ( error ) {
        throw new Error( 'Unable to retrieve user data.' );
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

UserService.prototype.getUser = UserService.prototype.deserializeId;

/**
 * Get a list of defined user roles.
 *
 * @returns {Array} list of defined user roles.
 */
UserService.prototype.getRoleNames = function () {
    return User.roleNames();
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

    if ( userDTO.tier && typeof userDTO.tier === 'string' ) {
        newuser.tier = User[newuser.tier] || newuser.tier;
    }

    if ( ! newuser.isValid() ) {
        throw new Error( 'User registration invalid' );
    }

    return context.userRepository.getByUsername( newuser.username )
    .then( function ( existingUser ) {
        if ( existingUser ) {
            throw new Error(
                'User already registered: ' + existingUser.username
            );
        }
        newuser.hashPassword();
        return context.userRepository.insert( newuser );
    });
};

/**
 * Get all user objects.
 *
 * @returns {Promise|User|Array} Promises an Array of User objects.
 */
UserService.prototype.getUsers = function () {
    return this.userRepository.getAll();
};

UserService.prototype.getAgencySubscribers = function ( agencyID ) {
    return this.userRepository.getByAgencySubscription( agencyID );
};

/**
 * Reset a user's password.
 *
 * @param {String} - the user id
 * @param {String} - the password to change to
 * @returns {User} an updated user object
 */
UserService.prototype.resetPassword = function ( id, password ) {
    var context = this;

    return context.userRepository.getById( id ).then( function ( user ) {
        user.password = password;
        user.hashPassword();
        return context.userRepository.update( user );
    }, function ( error ) {
        throw new Error( 'Unable to get current user data: ', error.message );
    })
    .catch( function ( error ) {
        throw new Error( 'Error saving password to repository: ', error.message );
    });
};

/**
 * Update user data.
 *
 * @param {String} - the id of the user to update
 * @param {Object} - object with the data to update, null values indicate no
 * change
 * @returns {Promise|User} the updated user object
 */
UserService.prototype.updateUser = function ( id, userDTO ) {
    var context = this;

    return context.userRepository.getById( id ).then( function ( user ) {
        function blacklisted ( key ) {
            var list = [ 'password', 'tier', 'notifications' ];
            return ( -1 !== list.indexOf( key ) );
        }

        if ( typeof userDTO.tier === 'string' && undefined !== User[userDTO.tier] ) {
            user.tier = User[userDTO.tier];
        }

        if ( userDTO.agency && userDTO.agency !== user.agency ) {
            user.notifications.push( userDTO.agency );
        }

        Object.keys( user.data ).forEach( function ( key ) {
            if ( userDTO[key] && ! blacklisted( key ) ) {
                user[key] = userDTO[key];
            }
        });

        return context.userRepository.update( user );
    }, function ( error ) {
        throw new Error(
            'Unable to get user id ' + id + ': ' + error.message
        );
    })
    .catch( function ( error ) {
        throw new Error(
            'Error saving user data changes to repository: ' + error.message
        );
    });
};

/**
 * Remove a list of notifications from the specified user (by id)
 *
 * @param {String} - the id of the user to remove notifications from
 * @param {String|Array} - array of agency ids to remove from the user
 * @returns {Promise|User} an updated user object
 */
UserService.prototype.removeNotifications = function ( id, agencylist ) {
    var context = this;

    return context.userRepository.getById( id ).then( function ( user ) {
        user.notifications = _.difference( user.notifications, agencylist );
        return context.userRepository.update( user );
    })
    .catch( function ( error ) {
        throw new Error(
            'Error registering new notifications: ', + error.message
        );
    });
};

/**
 * Add a list of notifications to the specified user (by id)
 *
 * @param {String} - the id of the user to add notifications to
 * @param {String|Array} - array of agency ids to add to the user
 * @returns {Promise|User} an updated user object
 */
UserService.prototype.addNotifications = function ( id, agencylist ) {
    var context = this;

    return context.userRepository.getById( id ).then( function ( user ) {
        user.notifications = _.union( user.notifications, agencylist );
        return context.userRepository.update( user );
    })
    .catch( function ( error ) {
        throw new Error(
            'Error registering new notifications: ', + error.message
        );
    });
};

/**
 * Remove a user from the system.
 *
 * @param {String} - the id of the user to remove
 * @returns {Object} - a response from the persistence layer
 *
 * @todo find out the policy for removing users, does removing a user affect
 * BOLOs attached to the user? Should a user really be deleted or maybe just
 * disabled?
 */
UserService.prototype.removeUser = function ( id ) {
    return this.userRepository.remove( id );
};

/**
 * Attempt to create a formatted object suitable for use with UserService
 * methods.
 *
 * @param {Object} - the input data object
 * @return {Object} DTO object containing keys identified as suitable from the
 * input object.
 */
UserService.formatDTO = function ( dto ) {
    var userDTO = new User().data;

    Object.keys( userDTO ).forEach( function ( key ) {
        userDTO[key] = dto[key] || null;
    });

    return userDTO;
};

/**
 * A convenience wrapper to the static UserService.formatDTO method.
 * @see {@link UserService.formatDTO}
 */
UserService.prototype.formatDTO = function ( dto ) {
    return UserService.formatDTO( dto );
};
