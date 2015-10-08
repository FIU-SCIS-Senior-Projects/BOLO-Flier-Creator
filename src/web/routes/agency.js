/* Module Dependencies */
var router = require('express').Router();
var cloudant = require(__dirname + '/../lib/cloudant-connection.js');

function getPriviledge(username) {
    var user = cloudant.db.use('bolo_users');
    user.get(username, function(error, currUser) {
        //get the user's account status and set priviledged to the proper level
        return currUser.userTier;
    });
}

//create an agency, should ONLY be used by tier 1/admin users
router.post('/create', function(request, response) {
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
router.put('', function(request, response) {
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
router.get('', function(request, response) {
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
router.delete('', function(request, response) {
    var agencies = cloudant.db.use('bolo_agencies");');
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
                        console.log("Unable to delete "+name+" agency.\n", error);
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



module.exports = router;
