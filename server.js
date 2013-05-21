var db = require('./src/models/db');
var	webserver = require('./src/http/webserver');
db.start(function() {
	new webserver({
		port : 8080
	}).start();
});
