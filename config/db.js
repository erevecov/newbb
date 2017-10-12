require('dotenv').load();

var username = process.env.DB_USER,
password = process.env.DB_PASSWORD,
url = 'http://' + username + ':' + password + '@db.blackbox.land:5984/';

export default url;
