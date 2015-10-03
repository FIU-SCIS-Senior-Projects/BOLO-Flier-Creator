/* jshint node: true, mocha: true, expr: true */
'use strict';

/*
 * BOLO Domain Entity
 *
 */

/**
 * Bolo constructor
 *
 * @constructor
 * @param {Object} data - Object containing the Bolo Data
 *
 */
function Bolo ( data ) {
    this.data = data;
}

/**
 * Checks if the bolo is valid
 */
Bolo.prototype.isValid = function () {
    // TODO Validate data
    return true;
};

module.exports = Bolo;
