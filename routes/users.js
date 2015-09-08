
//bcrypt will encrypt passwords
var bcrypt = require('bcrypt');
//and thois adds salt to all the passwords
var salt = bcrypt.genSaltSync(10);
/* NOTE: to hash passwords, use bcrypt.hashSync("PASSWORD", salt); */


