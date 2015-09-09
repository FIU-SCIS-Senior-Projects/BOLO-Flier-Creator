var Cloudant = require('cloudant');

/* Default credentials */
var dbCredentials = {
     "host"     : "3aaf17de-e73e-489d-921c-51bb08b6b041-bluemix.cloudant.com",
     "username" : "3aaf17de-e73e-489d-921c-51bb08b6b041-bluemix",
     "password" : "c994ec5c76dbf6629f4a409b7a8593d45ceacb17e2e7560c11e162278e6c5618",
     "port"     : 443,
     "url"      : "https://3aaf17de-e73e-489d-921c-51bb08b6b041-bluemix:c994ec5c76dbf6629f4a409b7a8593d45ceacb17e2e7560c11e162278e6c5618@3aaf17de-e73e-489d-921c-51bb08b6b041-bluemix.cloudant.com"
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
