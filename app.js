
//@Author: David Vizcaino david.e.vizcaino@gmail.com
//================ Load all Dependencies ===================
var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

// Require Route Modules
var UsersEndpoints = require('./routes/users'),
    BolosEndpoints = require('./routes/bolos'),
    AgencyEndpoints = require('./routes/agency');

// Required Third Party Middleware
var expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// Initialize
var app = express();


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


/* =============================================================================
 * =============================================================================
 *  From here on out are the HTTP methods and what app (express) does with each
 *   (with respect to the URI)
 */

// router middleware to authenticate user before doing any action(s)
app.use(['/bolo', '/agency'], function(request, response, next) {
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

app.use("/users", UsersEndpoints);
app.use('/bolo', BolosEndpoints);
app.use('/agency', AgencyEndpoints);

//LAUNCH THE SERVER!!!
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
