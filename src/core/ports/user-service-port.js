/* jshint node: true */
'use strict';

var Promise = require('promise');


module.exports = UserServicePort;


function UserServicePort ( userRepository ) {
    this.userRepository = userRepository;
}

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

UserServicePort.prototype.deserializeId = function ( id ) {
    return this.userRepository.getById( id );
};
