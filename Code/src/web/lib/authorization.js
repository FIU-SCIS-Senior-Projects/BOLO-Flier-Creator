/* jshint node: true */
'use strict';


/**
 * @todo Look into a more robust solution for authorization
 *
 * This is method has too much knowledge about the internals of the user
 * object which violates the goals of the architectural decisions made for
 * this project.
 *
 * Refer to Mingle #576 and #603 for authorization policy.
 **/
function BoloAuthorize ( bolo, author, user ) {
    this.bolo = bolo;
    this.author = author;
    this.user = user;
}

BoloAuthorize.prototype.isAdmin = function () {
    return 3 === this.user.tier;
};

BoloAuthorize.prototype.sameUser = function () {
    return this.user.id == this.bolo.author;
};

BoloAuthorize.prototype.sameAgency = function () {
    return this.user.agency == this.bolo.agency;
};

BoloAuthorize.prototype.canSupervise = function () {
    return this.user.tier > this.author.tier;
};

BoloAuthorize.prototype.authorizedToEdit = function () {
    if ( this.isAdmin() ) return true;
    if ( this.canSupervise() && this.sameAgency() ) return true;
    if ( this.sameUser() && this.sameAgency() ) return true;

    throw new Error( 'Unauthorized request to edit bolo: ' + this.bolo.id );
};

BoloAuthorize.prototype.authorizedToDelete  = function () {
    if ( this.isAdmin() ) return true;
    if ( this.canSupervise() && this.sameAgency() ) return true;

    throw new Error( 'Unauthorized request to delete bolo: ' + this.bolo.id );
};

BoloAuthorize.prototype.authorizedToArchive = function () {
    if ( this.isAdmin() ) return true;
    if ( this.canSupervise() && this.sameAgency() ) return true;

    throw new Error( 'Unauthorized request to archive bolo: ' + this.bolo.id );
};

module.exports.BoloAuthorize = BoloAuthorize;
