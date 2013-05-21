var ImportQueue = require('./src/models/ImportQueue');
var db = require('./src/models/db');
var DataCollector = require('./src/data-collection/DataCollector');
var Article = require('./src/models/Article');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if(cluster.isMaster) {
	db.start(function() {
		var count = 0;
		function processQueue() {
			if(count < numCPUs*2) {
				++count;
				ImportQueue.dequeue(function(err, link) {
					if(link != null)
					{
						console.log("Fork", count)
						var worker = cluster.fork({
							url : link.url,
							importer : link.importer
						});
						worker.on('exit', function() {
							count -= 1;
							console.log("Process exited", count);
							processQueue();
						});
						processQueue();
						
					}
					else
						db.stop();
				});
			}
		}

		processQueue();
	});
	
	
} else if(cluster.isWorker) {
	var link = {url : process.env.url, importer : process.env.importer};
	db.start(function() {
		DataCollector.getArticle(link, function(err, article) {
			Article.save(article, function() {
				process.exit(0);
			});
		});
	});
	
}
