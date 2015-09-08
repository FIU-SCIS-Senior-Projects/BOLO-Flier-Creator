
//@Author: David Vizcaino david.e.vizcaino@gmail.com
//================ Load all Dependencies ===================
var express = require('express'), 
    routes = require('./routes'),
    users = require('./routes/users'),
    //begin = require('./routes/begin'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

//used for routing (prepending to URI)
var router = express.Router();

//used to access and store session data
var expressSession = require('express-session');
//router used for BOLO commands
var router = express.Router();
//router used for Agency commands
var agencyRouter = express.Router();
//actual express commands
var app = express();
var db;
//cloudant database
var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName : 'my_sample_db'
};

//bcrypt will encrypt passwords
var bcrypt = require('bcrypt');
//and this adds salt to all the passwords
var salt = bcrypt.genSaltSync(10);
/* NOTE: to hash passwords, use bcrypt.hashSync("PASSWORD", salt); */

//allows us to read whats in messages sent ia HTTP
var bodyParser = require('body-parser');
//allows us to read whats in cookies
var cookieParser = require('cookie-parser');

var methodOverride = require('method-override');

var logger = require('morgan');

var errorHandler = require('errorhandler');

var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments

//router.use(function(req, res){
//	//log data
//	console.log('Something has been done.');
//});

//set to port 3000
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
//templating engine; can be changed to whatever
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));

//use express for setting and tracking cookies
//app.use(cookieParser());
app.use(cookieParser('Passw0rd'));
app.use(expressSession({ secret: 'Passw0rd',
    cookie: { secure: true } }));

//body parser allows us to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use the router
//app.use('', router);

app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function initDBConnection() {

    if(process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        if(vcapServices.cloudantNoSQLDB) {
            dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
            dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
            dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
            dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
            dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
        }
        console.log('VCAP Services: '+JSON.stringify(process.env.VCAP_SERVICES));
    }
    else{
        dbCredentials.host = "ffe37731-0505-4683-96a8-87d02a33e03e-bluemix.cloudant.com";
        dbCredentials.port = 443;
        dbCredentials.user = "ffe37731-0505-4683-96a8-87d02a33e03e-bluemix";
        dbCredentials.password = "c7003d0b156d9c4ce856c4e6b4427f3b576c7ea6229235f0369ada1ed47b159c";
        dbCredentials.url = "https://ffe37731-0505-4683-96a8-87d02a33e03e-bluemix:c7003d0b156d9c4ce856c4e6b4427f3b576c7ea6229235f0369ada1ed47b159c@ffe37731-0505-4683-96a8-87d02a33e03e-bluemix.cloudant.com";

    }

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    //	cloudant.db.create(dbCredentials.dbName, function (err, res) {
    //		if (err) { console.log('could not create db ', err); }
    //    });
    //db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

//gets current time; useful for bolo creation and update
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var year = date.getFullYear();
    var month = date.getMonth() +1;
    var day = date.getDay();

    //Append 0 to all values less than 10;
    hour = (hour < 10? "0" : "") + hour;
    minutes = (minutes < 10? "0" : "") + minutes;
    seconds = (seconds < 10? "0" : "") + seconds;
    month = (month < 10? "0" : "") + month;
    day = (day < 10? "0" : "") + day;
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}

/* =============================================================================
 * =============================================================================
 *  From here on out are the HTTP methods and what app (express) does with each
 *   (with respect to the URI)
 */

//Create a new user
app.post('/users/create', function(request, response) {
    //TODO: check for duplicate username, simply query server for user with same username
    //and store all the data (minus unhashed password) in cloudant db bolo_users table
    var users = cloudant.db.use('bolo_users');

    users.get("currentUserCount", function(err, currentCount) {
        //max users created so far
        var maxUsers = currentCount.totalNum;
        //needed to update total
        var rev = currentCount._rev;
        if (err) {
            //do something
        }
        else {
            users.insert({
                userID: ++maxUsers,
                username : request.body.username,
                password : bcrypt.hashSync(request.body.password, salt),
                fName : request.body.firstName,
                lName : request.body.lastName,
                dob : request.body.dob,
                dept : request.body.agency,
                userTier: request.body.tier
            }, username, function(err, doc) {
                //if user creation failed, log the error and return a message
                if (err) {
                    console.log(err);
                    response.json({ Result: 'Failure', Message: 'Account Creation Failed'});
                }
                else {
                    //if it succeeded, inform the user
                    console.log("Created user with username " + username);
                    //update max users
                    users.insert({
                        _rev: rev,
                        totalNum: maxUsers
                    }, "currentUserCount", function(err, doc) {
                        //TODO: Decide what to do if there is an error...
                        if (err) {
                            console.log(err);
                        }
                    });
                    response.json({ Result: 'Success', Message: 'Account Successfully Created!'});
                }

            });//end user.insert
        }//end else
    });//end users.get currentUserCount
});

//TODO: Grab user info

//Allow a user to login (if account exists)
app.post('/users/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var users = cloudant.db.use('bolo_users');

    if (request.cookies.boloUsername) {
        //inform user they are already logged in
        response.json({ Result: 'Invalid', Message: 'You are already logged in' });
        //res.send
    }
    else{
        //get the the user from the database based on username
        console.log("\n\nCOOKIES ARE: ", request.cookies);
        users.get(username, function(err, existingUser) {
            if(!existingUser) {
                response.json({ Result: 'Failure', Message: 'Login failed, please check password/username'});
            }
            else {
                //grab the hashed password and compare it to the current password
                var hashedPass = existingUser.password;
                var isMatch = bcrypt.compareSync(password, hashedPass);

                //if the passwords match
                if (isMatch) {
                    //store the data in a secure cookie
                    response.cookie('boloUsername', username, { domain: '.mybluemix.net' });
                    response.cookie('boloFirstName', existingUser.fName, { domain: '.mybluemix.net' });
                    response.cookie('boloLastName', existingUser.lName, { domain: '.mybluemix.net' });
                    response.cookie('boloDepartment', existingUser.agency, { domain: '.mybluemix.net' });

                    response.json({ Result: 'Success', Message: 'Login Successful!' });
                }
                else {
                    response.json({ Result: 'Failure', Message: 'Login failed, please check password/username'});
                }

            }
        });
    }

});

//logout a  user and clear his cookie
app.get('/users/logout', function(request, response) {
    //clear cookie data to log user out
    response.clearCookie('boloUsername', { domain: '.mybluemix.net' });
    response.clearCookie('boloFirstName', { domain: '.mybluemix.net' });
    response.clearCookie('boloLastName', { domain: '.mybluemix.net' });
    response.clearCookie('boloDepartment', { domain: '.mybluemix.net' });

    response.json({ Result: 'Success', Message: 'You have been logged out of the system'});
    //redirect back to homepage
    //response.redirect('/home');
});
//router.route('/user')
//	.post(users.create)
//	.get(users.login);


/**
 * =========USING ROUTER FROM HERE FOR USER AUTHENTICATION BEFORE PERFORMING ACTIONS========
 */

//router middleware to authenticate user before doing any action(s)
router.use(function(request, response, next) {
    //AUTHENTICATE USER HERE
    if (request.cookies.boloUsername) {
        //if user is logged in, then continue
        console.log("User authenticated!\n");
        next();
    }
    else {
        //otherwise, give an error
        response.json({Result: 'Failure', Message : 'Please log in to continue'});
    }


});

//create a BOLO report
router.post('/create', function(request, response) {

    //store all data in DB
    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("currentBOLOCount", function(err, currentCount) {
        //max users created so far
        var currentBOLOs = currentCount.totalNum;
        //needed to update total
        var rev = currentCount._rev;
        if (err) {
            //do something
        }
        else {
            fliers.insert({
                boloID : ++currentBOLOs,
                creationDate : getDateTime(),
                lastUpdate : "",
                authorFName : request.cookies.boloFirstName,
                authorLName : request.cookies.boloLastName,
                authorUName : request.cookies.boloUsername,
                category : request.body.category,
                imageURL : request.body.imageURL,
                videoLink : request.body.videoLink,
                firstName : request.body.fName,
                lastName : request.body.lName,
                dob : request.body.dob,
                dlNumber : request.body.dlNumber,
                race : request.body.race,
                sex : request.body.sex,
                height : request.body.height,
                weight : request.body.weight,
                hairColor : request.body.hairColor,
                tattoos : request.body.tattoos,
                address : request.body.address,
                additional : request.body.additional,
                summary : request.body.summary,
                agency : request.body.agency,
                archive : false
            }, "bolo"+currentBOLOs, function(err, doc) {
                //TODO: fix code below
                //if user creation failed, log the error and return a message
                if (err) {
                    console.log(err);
                    response.json({ Result: 'Failure', Message: 'Error creating BOLO'});
                }
                else {
                    //if it succeeded, inform the user
                    console.log("Created BOLO with ID#" + currentBOLOs);
                    //update max users
                    fliers.insert({
                        _rev: rev,
                        totalNum: currentBOLOs
                    }, "currentBOLOCount", function(err, doc) {
                        //TODO: Decide what to do if there is an error...
                        if (err) {
                            console.log(err);
                        }
                    });
                    response.json({ Result: 'Success', Message: 'BOLO Successfully Created!',
                        boloID: currentBOLOs});
                }

            });//end flier.insert
        }//end else
    });//end flier.get currentUserCount
});

router.get('', function(request, response) {

    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("bolo"+request.query.boloID, function(err, bolo) {

        if (err) {
            response.json({ Result: 'Failure', Message: 'Bolo not found' });
        }
        else {
            console.log("Retrivied bolo with ID#" +bolo.boloID+"\n");
            response.json({ creationDate: bolo.creationDate, lastUpdate: bolo.lastUpdate, authorFName: bolo.authorFName, authorLName: bolo.authorLName,
                authorID: bolo.authorID, category: bolo.category, imageURL: bolo.imageURL, videoLink: bolo.videoLink, firstName: bolo.fName,
                lastName: bolo.lName, dob: bolo.dob, dlNumber: bolo.dlNumber, race: bolo.race, sex: bolo.sex, height: bolo.height,
                weight: bolo.weight, hairColor: bolo.hairColor, tattoos: bolo.tattoos, address: bolo.address, 
                additional: bolo.additionalInfo, summary: bolo.summary, agency: bolo.agency, boloID: bolo.boloID});
        }
    });//end flier.get currentUserCount
})

//deletes a bolo
router.delete('', function(request, response) {

    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("bolo"+request.body.boloID, function(err, bolo) {

        if (err) {
            response.json({ Result: 'Failure', Message: 'Bolo not found' });
        }
        else {
            var revisionID = bolo._rev;
            var boloID = request.body.boloID;
            console.log("Deleting bolo with ID#" +boloID+"\n");

            fliers.destroy("bolo"+boloID, revisionID, function(error, body) {
                if (error) {
                    console.log("Unable to delete bolo with ID#"+boloID+".\n", error)
                        response.json({ Result: 'Failure', Message: 'Unable to delete bolo.',
                            boloID: boloID});
                }
                else {
                    console.log("Successfully deleted bolo with ID#"+boloID+"\n");
                    response.json({ Result: 'Success', Message: 'Bolo has been deleted.',
                        boloID: boloID});
                }
            });//end of destroy

        }
    });//end flier.get currentUserCount

})

//updates a field in a bolo
router.put('', function(request, response) {

    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("bolo"+request.query.boloID, function(err, bolo) {

        if (err) {
            response.json({ Result: 'Failure', Message: 'Bolo not found' });
        }
        else {
            var revisionID = bolo._rev;
            var boloID = bolo.boloID;
            console.log("Updating bolo with ID#" +bolo.boloID+"\n");
            fliers.insert({
                _rev: revisionID,
                lastUpdate : getDateTime(),
                category : request.body.category,
                imageURL : request.body.imageURL,
                videoLink : request.body.videoLink,
                firstName : request.body.fName,
                lastName : request.body.lName,
                dob : request.body.dob,
                dlNumber : request.body.dlNumber,
                race : request.body.race,
                sex : request.body.sex,
                height : request.body.height,
                weight : request.body.weight,
                hairColor : request.body.hairColor,
                tattoos : request.body.tattoos,
                address : request.body.address,
                additional : request.body.additional,
                summary : request.body.summary,
                agency : request.body.agency
            }, "bolo"+request.query.boloID, function(err, doc) {
                //TODO: fix code below
                //if user creation failed, log the error and return a message
                if (err) {
                    console.log(err);
                    response.json({ Result: 'Failure', Message: 'Unable to find BOLO'});
                }
                else {
                    //if it succeeded, inform the user
                    console.log("Updated BOLO with ID#" + request.query.boloID);

                    response.json({ Result: 'Success', Message: 'BOLO Successfully Updated.',
                        boloID: request.query.boloID});
                }

            });//end flier update

        }
    });//end flier.get currentUserCount

})


//begin using router
app.use('/bolo', router);


/*
 * =================== AGENCY ROUTING BEGINS HERE ==========================
 */

function getPriviledge(username) {
    var user = cloudant.db.use('bolo_users');
    user.get(username, function(error, currUser) {
        //get the user's account status and set priviledged to the proper level
        return currUser.userTier;
    });
}

agencyRouter.use(function(request, response, next) {

    if (request.cookies.boloUsername) {
        //if user is logged in, then continue
        console.log("User authenticated!\n");
        next();
    }
    else {
        //otherwise, give an error
        response.json({Result: 'Failure', Message : 'Please log in to continue'});
    }

});

//create an agency, should ONLY be used by tier 1/admin users
agencyRouter.post('/create', function(request, response) {
    var priviledge = getPriviledge(request.cookies.boloUsername);

    //if it's higher than 1, user lacks rights to create and agency
    if (priviledge > 1) {
        response.json({Result: 'Failure', Message : 'Insufficient Priviledges'});
    }
    else {
        var agencies = cloudant.db.use('bolo_agencies');
        agencies.insert({
            name: request.body.name,
            address: {
                address: request.body.address,
                city: request.body.city,
                zip: request.body.zip
            },
            phone: request.body.phone,
            shield: request.body.shieldImage,
            logo: request.body.logoImage,
            chief: request.body.chief
        }, request.body.name, function(err, doc) {
            if (err) {
                response.json({Result: 'Failure', Message: 'Unable to create agency. It may already exist.'});
            }
            else {
                response.json({Result: 'Success', Message: 'Agency successfully created.'});
            }
        });
    }//end of priviledged else
});

//Updates an Agency. Can only be used by tier 1 user or agency chief
agencyRouter.put('', function(request, response) {
    var priviledge = getPriviledge(request.cookies.boloUsername);
    var agencies = cloudant.db.use('bolo_agencies');

    agencies.get(request.body.name, function(error, agency) {
        if (priviledge > 1 || request.cookies.boloUsername == agency.chief) {
            //edit agency data
            agencies.put({
                name: request.body.name,
                address: {
                    address: request.body.address,
                    city: request.body.city,
                    zip: request.body.zip
                },
                phone: request.body.phone,
                shield: request.body.shieldImage,
                logo: request.body.logoImage,
                chief: request.body.chief
            }, request.body.name, function(err, doc) {
                if(err) {
                    response.json({Result: 'Failure', Message: 'Unable to update Agency. Please Try again later.'});
                }
                else {
                    response.json({Result: 'Success', Message: 'Agency succesfully updated.'});
                }
            });
        }
        else {
            //user lacks right to edit
            response.json({Result: 'Failure', Message: 'Insufficient Priviledges'});
        }
    });//end of agencies get
});


//Grabs info on an agency
agencyRouter.get('', function(request, response) {
    var agencies = cloudant.db.use('bolo_agencies');

    agencies.get(request.query.agency, function(error, agency) {
        if (error) {
            response.json({Result: 'Failure', Message: 'Unable to retrieve agency. It may not exist.'});
        }
        else {
            response.json({ Name: agency.name,
                Address: {address: agency.address.address, city: agency.address.city, zip: agency.address.zip},
                Phone: agency.phone, shield: agency.shield, logo: agency.logo, chief: agency.chief });
        }
    });
});

//Delete an agency from the database
agencyRouter.delete('', function(request, response) {
    var agencies = cloudant.db.use('bolo_agencies");')
        agencies.get("bolo"+request.body.boloID, function(err, agency) {

            if (err) {
                response.json({ Result: 'Failure', Message: 'Agency not found' });
            }
            else {
                var revisionID = agency._rev;
                var name = request.body.name;
                console.log("Deleting " +name+" agency.\n");

                agencies.destroy(name, revisionID, function(error, body) {
                    if (error) {
                        console.log("Unable to delete "+name+" agency.\n", error)
                            response.json({ Result: 'Failure', Message: 'Unable to delete agency.',
                                Agency: name});
                    }
                    else {
                        console.log("Successfully deleted "+name+" agency.\n");
                        response.json({ Result: 'Success', Message: 'Agency has been deleted.',
                            Agency: name});
                    }
                });//end of destroy

            }
        });//end agencies.get currentUserCount
});

app.use('/agency', agencyRouter);

//LAUNCH THE SERVER!!!
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
