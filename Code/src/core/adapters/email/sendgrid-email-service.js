if ( ! process.env.SENDGRID_API_KEY ) {
    throw new Error(
        'SendGrid API key not found: SENDGRID_API_KEY should be set.'
    );
}

var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);


/**
 * Send an email (payload) via the SendGrid service.
 *
 * @param {Object} - an object containing email details {to, from, fromName,
 * subject, text, html}
 * @returns {Promise|Object} the response object
 */
module.exports.send = function ( payload ) {
    var email = new sendgrid.Email( payload );
    return new Promise( function ( resolve, reject ) {
        sendgrid.send( payload, function ( err, json ) {
            if ( err ) reject( err );
            else resolve( json );
        });
    });
};
