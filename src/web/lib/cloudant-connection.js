var Cloudant = require('cloudant');

/* Assume default credentials using dotenv */
require('dotenv')
    .config({ path: __dirname + '/../../../.env' });
var dbCredentials = {
    "host"      : process.env.CLOUDANT_HOST,
    "port"      : process.env.CLOUDANT_PORT,
    "user"      : process.env.CLOUDANT_USER,
    "password"  : process.env.CLOUDANT_PASS,
    "url"       : process.env.CLOUDANT_URL
};

/* Check for Cloudant Credentials in Bluemix VCAP_SERVICES */
if ( process.env.VCAP_SERVICES ) {
    var vcapServices = JSON.parse( process.env.VCAP_SERVICES );

    if ( vcapServices.cloudantNoSQLDB ) {
        dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
        dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
        dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
        dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
        dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
    }
}

/* Initialized Cloudant Connection */
var cloudant = Cloudant( dbCredentials, function( er, cloudant, reply ) {
    if ( er ) {
        throw er;
    }

    console.log('Connected with username: %s', reply.userCtx.name);
});

// check if DB exists if not create
//cloudant.db.create(dbCredentials.dbName, function (err, res) {
//    if (err) { console.log('could not create db ', err); }
//});
//db = cloudant.use(dbCredentials.dbName);

module.exports = cloudant;
