/* jshint node: true */
'use strict';

var Promise = require('promise');


module.exports = AccountServicePort;


function AccountServicePort ( userRepository ) {
    this.userRepository = userRepository;
}


AccountServicePort.prototype.authenticate = function ( username, password ) {
    var userPromise = this.userRepository.getByUsername( username );

    return userPromise
    .then( function ( user ) {
        if ( user.data.password == password ) {
            return Promise.resolve( user );
        }
    });
};
