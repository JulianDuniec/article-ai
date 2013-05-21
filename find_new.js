var ImportQueue = require('./src/models/ImportQueue');
var DataCollector = require('./src/data-collection/DataCollector');
var db = require('./src/models/db');

db.start(function() {
	DataCollector.getLinks(
		function(link, importer) {
			ImportQueue.enqueue(importer, link, function(res) {
				if(res != null) console.log(res);
			});
		},
		function() {
			db.stop();
		}
	);
})

