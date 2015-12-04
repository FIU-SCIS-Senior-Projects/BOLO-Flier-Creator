/* jshint node: true, mocha: true, expr: true */
'use strict';

var _ = require('lodash');
var Entity = require('./entity');

var schema = {
    author: {
        required: true,
        type: 'string'
    },
    agency: {
        required: true,
        type: 'string'
    }
};

var required = Object.keys(schema).filter(function (key) {
    return schema[key].required;
});

var defaults = {
    id              : null,
    createdOn       : '',
    lastUpdatedOn   : '',
    agency          : '',
    author          : '',
    category        : '',
    firstName       : '',
    lastName        : '',
    dob             : '',
    dlNumber        : '',
    race            : '',
    sex             : '',
    height          : '',
    weight          : '',
    hairColor       : '',
    tattoos         : '',
    address         : '',
    additional      : '',
    summary         : '',
    attachments     : {},
    video_url       : '',
    isActive        : '',
    status          : ''
};

/** @module core/domain */
module.exports = Bolo;


/**
 * Create a new Bolo object.
 *
 * @class
 * @classdesc Entity object representing a BOLO.
 *
 * @param {Object} data - Object containing Bolo Data properties
 */
function Bolo( data ) {
    this.data = _.extend( {}, defaults, data );
    Entity.setDataAccessors( this.data, this );
}

/**
 * Checks if the bolo is valid
 *
 * @returns {bool} true if passes validation, false otherwise
 *
 * @todo Naive validation implementation, refactor using a robust validation
 * library like Joi. It might be useful to implement validation with a Bolo
 * Template object
 */
Bolo.prototype.isValid = function () {
    var data = this.data;

    var result = required.filter( function ( key ) {
        return ( data[key] && typeof data[key] === schema[key].type );
    });

    return ( result.length === required.length );
};

/**
 * Attach an image file reference to the bolo data. Reference should be
 * usable by a Media Adapter.
 *
 * @param {Object} - Meta data object containing a UUID and filename
 */
Bolo.prototype.attachImage = function (meta) {
    this.data.image = this.data.image || [];
    this.data.image = this.data.image.concat(meta);
};

/**
 * Attach a video file reference to the bolo data. Reference should be
 * usable by a Media Adapter.
 *
 * @param {Object} - Meta data object containing a UUID and filename
 */
Bolo.prototype.attachVideo = function (meta) {
    this.data.video = this.data.video || [];
    this.data.video = this.data.video.concat(meta);
};

/**
 * Attach an audio file reference to the bolo data. Reference should be
 * usable by a Media Adapter.
 *
 * @param {Object} - Meta data object containing a UUID and filename
 */
Bolo.prototype.attachAudio = function (meta) {
    this.data.audio = this.data.audio || [];
    this.data.audio = this.data.audio.concat(meta);
};

/**
 * Check if the supplied bolo object has the same data attribute values as the
 * source bolo object's own enumerable data attribute values.
 *
 * @param {Bolo} - the other bolo object to compare to
 */
Bolo.prototype.same = function ( other ) {
    return 0 === this.diff( other ).length;
};

/**
 * Returns an array of keys differing from the source user object.
 *
 * @param {Bolo} - the other bolo to compare to
 */
Bolo.prototype.diff = function ( other ) {
    var source = this;
    return Object.getOwnPropertyNames( source.data )
        .filter( function ( key ) {
            return ! _.isEqual( other.data[key], source.data[key] );
        });
};
