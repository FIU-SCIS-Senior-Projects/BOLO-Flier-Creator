/* Module Dependencies */
var router = require('express').Router();
var cloudant = require(__dirname + '/../lib/cloudant-connection.js');

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

//create a BOLO report
router.post('/create', function(req, res) {
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
                authorFName : req.cookies.boloFirstName,
                authorLName : req.cookies.boloLastName,
                authorUName : req.cookies.boloUsername,
                category : req.body.category,
                imageURL : req.body.imageURL,
                videoLink : req.body.videoLink,
                firstName : req.body.fName,
                lastName : req.body.lName,
                dob : req.body.dob,
                dlNumber : req.body.dlNumber,
                race : req.body.race,
                sex : req.body.sex,
                height : req.body.height,
                weight : req.body.weight,
                hairColor : req.body.hairColor,
                tattoos : req.body.tattoos,
                address : req.body.address,
                additional : req.body.additional,
                summary : req.body.summary,
                agency : req.body.agency,
                archive : false
            }, "bolo"+currentBOLOs, function(err, doc) {
                //TODO: fix code below
                //if user creation failed, log the error and return a message
                if (err) {
                    console.log(err);
                    res.json({ Result: 'Failure', Message: 'Error creating BOLO'});
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
                    res.json({ Result: 'Success', Message: 'BOLO Successfully Created!',
                        boloID: currentBOLOs});
                }

            });//end flier.insert
        }//end else
    });//end flier.get currentUserCount
});

router.get('', function(req, res) {

    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("bolo"+req.query.boloID, function(err, bolo) {

        if (err) {
            res.json({ Result: 'Failure', Message: 'Bolo not found' });
        }
        else {
            console.log("Retrivied bolo with ID#" +bolo.boloID+"\n");
            res.json({ creationDate: bolo.creationDate, lastUpdate: bolo.lastUpdate, authorFName: bolo.authorFName, authorLName: bolo.authorLName,
                authorID: bolo.authorID, category: bolo.category, imageURL: bolo.imageURL, videoLink: bolo.videoLink, firstName: bolo.fName,
                lastName: bolo.lName, dob: bolo.dob, dlNumber: bolo.dlNumber, race: bolo.race, sex: bolo.sex, height: bolo.height,
                weight: bolo.weight, hairColor: bolo.hairColor, tattoos: bolo.tattoos, address: bolo.address, 
                additional: bolo.additionalInfo, summary: bolo.summary, agency: bolo.agency, boloID: bolo.boloID});
        }
    });//end flier.get currentUserCount
})

//deletes a bolo
router.delete('', function(req, res) {

    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("bolo"+req.body.boloID, function(err, bolo) {

        if (err) {
            res.json({ Result: 'Failure', Message: 'Bolo not found' });
        }
        else {
            var revisionID = bolo._rev;
            var boloID = req.body.boloID;
            console.log("Deleting bolo with ID#" +boloID+"\n");

            fliers.destroy("bolo"+boloID, revisionID, function(error, body) {
                if (error) {
                    console.log("Unable to delete bolo with ID#"+boloID+".\n", error)
                        res.json({ Result: 'Failure', Message: 'Unable to delete bolo.',
                            boloID: boloID});
                }
                else {
                    console.log("Successfully deleted bolo with ID#"+boloID+"\n");
                    res.json({ Result: 'Success', Message: 'Bolo has been deleted.',
                        boloID: boloID});
                }
            });//end of destroy

        }
    });//end flier.get currentUserCount

})

//updates a field in a bolo
router.put('', function(req, res) {

    var fliers = cloudant.db.use('bolo_fliers');

    fliers.get("bolo"+req.query.boloID, function(err, bolo) {

        if (err) {
            res.json({ Result: 'Failure', Message: 'Bolo not found' });
        }
        else {
            var revisionID = bolo._rev;
            var boloID = bolo.boloID;
            console.log("Updating bolo with ID#" +bolo.boloID+"\n");
            fliers.insert({
                _rev: revisionID,
                lastUpdate : getDateTime(),
                category : req.body.category,
                imageURL : req.body.imageURL,
                videoLink : req.body.videoLink,
                firstName : req.body.fName,
                lastName : req.body.lName,
                dob : req.body.dob,
                dlNumber : req.body.dlNumber,
                race : req.body.race,
                sex : req.body.sex,
                height : req.body.height,
                weight : req.body.weight,
                hairColor : req.body.hairColor,
                tattoos : req.body.tattoos,
                address : req.body.address,
                additional : req.body.additional,
                summary : req.body.summary,
                agency : req.body.agency
            }, "bolo"+req.query.boloID, function(err, doc) {
                //TODO: fix code below
                //if user creation failed, log the error and return a message
                if (err) {
                    console.log(err);
                    res.json({ Result: 'Failure', Message: 'Unable to find BOLO'});
                }
                else {
                    //if it succeeded, inform the user
                    console.log("Updated BOLO with ID#" + req.query.boloID);

                    res.json({ Result: 'Success', Message: 'BOLO Successfully Updated.',
                        boloID: req.query.boloID});
                }

            });//end flier update

        }
    });//end flier.get currentUserCount
})


module.exports = router;
