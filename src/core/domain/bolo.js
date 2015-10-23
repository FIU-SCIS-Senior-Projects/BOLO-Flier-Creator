/* jshint node: true, mocha: true, expr: true */
'use strict';

var schema = {
    authorFName: {
        required: true,
        type: 'string'
    },
    authorLName: {
        required: true,
        type: 'string'
    },
    authorUName: {
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

var boloTemplate = {
    "_id": "",
    "_rev": "",
    "authorFName": "",
    "authorLName": "",
    "authorUName": "",
    "category": "",
    "firstName": "",
    "lastName": "",
    "dob": "",
    "dlNumber": "",
    "sex": "",
    "height": "",
    "weight": "",
    "tattoos": "",
    "videoLink": "",
    "additional": "",
    "summary": "",
    "enteredDT": "",
    "archive": "",
    "lastUnknownAddress": ""
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
function Bolo(data) {
    this.data = data || boloTemplate;
}

/**
 * Checks if the bolo is valid
 *
 * @returns {bool} true if passes validation, false otherwise
 */
Bolo.prototype.isValid = function () {
    // TODO Naive validation implementation, refactor using a robust validation
    // library like Joi. It might be useful to implement validation with a
    // Bolo Template object
    var data = this.data;
    var result = required.reduce(function (reqs, key) {
        if (data[key] && typeof data[key] === schema[key].type)
            return reqs.concat(key);
    }, []) || [];
    // if all required keys were pushed, then valid
    return (result.length === required.length);
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
