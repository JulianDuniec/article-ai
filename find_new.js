var LinkQueue = require('./src/data-access/LinkQueue');
var DataCollector = require('./src/data-collection/DataCollector');
var Article = require('./src/data-access/Article');
var cluster = require('cluster');

DataCollector.getLinks(
	function(link, importer) {
		LinkQueue.enqueue(importer, link);
	},
	function() {
		console.log("Complete!");
	}
);
