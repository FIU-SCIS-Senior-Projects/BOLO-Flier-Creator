/* Module Dependencies */
var router = require('express').Router();
var cloudant = require(__dirname + '/../lib/cloudant-connection.js');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

/* test route */

/* Create a new user */
router.post('/create', function(req, res) {
    // TODO: check for duplicate username, simply query server for user with
    // same username and store all the data (minus unhashed password) in
    // cloudant db bolo_users table
    var users = cloudant.db.use('bolo_users');

    users.get("currentUserCount", function(err, currentCount) {
        // max users created so far
        var maxUsers = currentCount.totalNum;

        // needed to update total
        var rev = currentCount._rev;

        if (err) {
            // do something
        }

        users.insert(
            {
                userID      : ++maxUsers,
                username    : req.body.username,
                password    : bcrypt.hashSync(req.body.password, salt),
                fName       : req.body.firstName,
                lName       : req.body.lastName,
                dob         : req.body.dob,
                dept        : req.body.agency,
                userTier    : req.body.tier
            },
            req.body.username,
            function(err, doc) {
                // if user creation failed, log the error and return a message
                if (err) {
                    console.log(err);
                    res.json({
                        Result: 'Failure',
                        Message: 'Account Creation Failed'
                    });
                    return;
                }

                // if it succeeded, inform the user
                console.log("Created user with username " + req.body.username);

                // update max users
                users.insert({
                    _rev: rev,
                    totalNum: maxUsers
                }, "currentUserCount", function(err, doc) {
                    // TODO: Decide what to do if there is an error...
                    if (err) {
                        console.log(err);
                    }
                });

                res.json({
                    Result: 'Success',
                    Message: 'Account Successfully Created!'
                });
            }
        ); // end user.insert
    }); // end users.get currentUserCount
});


// TODO: Grab user info


// Allow a user to login (if account exists)
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var users = cloudant.db.use('bolo_users');

    if (req.cookies.boloUsername) {
        //inform user they are already logged in
        res.json({
            Result: 'Invalid',
            Message: 'You are already logged in'
        });
    } else{
        //get the the user from the database based on username
        console.log("\n\nCOOKIES ARE: ", req.cookies);
        users.get(username, function(err, existingUser) {
            if(!existingUser) {
                res.json({
                    Result: 'Failure',
                    Message: 'Login failed, please check password/username'
                });
            } else {
                //grab the hashed password and compare it to the current password
                var hashedPass = existingUser.password;
                var isMatch = bcrypt.compareSync(password, hashedPass);

                //if the passwords match
                if (isMatch) {
                    //store the data in a secure cookie
                    res.cookie('boloUsername', username, { domain: '.mybluemix.net' });
                    res.cookie('boloFirstName', existingUser.fName, { domain: '.mybluemix.net' });
                    res.cookie('boloLastName', existingUser.lName, { domain: '.mybluemix.net' });
                    res.cookie('boloDepartment', existingUser.agency, { domain: '.mybluemix.net' });

                    res.json({ Result: 'Success', Message: 'Login Successful!' });
                }
                else {
                    res.json({ Result: 'Failure', Message: 'Login failed, please check password/username'});
                }

            }
        });
    }

});

//logout a  user and clear his cookie
router.get('/users/logout', function(req, res) {
    //clear cookie data to log user out
    res.clearCookie('boloUsername', { domain: '.mybluemix.net' });
    res.clearCookie('boloFirstName', { domain: '.mybluemix.net' });
    res.clearCookie('boloLastName', { domain: '.mybluemix.net' });
    res.clearCookie('boloDepartment', { domain: '.mybluemix.net' });

    res.json({ Result: 'Success', Message: 'You have been logged out of the system'});
});


module.exports = router;
