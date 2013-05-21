var LinkQueue = require('./src/data-access/LinkQueue');
var DataCollector = require('./src/data-collection/DataCollector');
var Article = require('./src/data-access/Article');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if(cluster.isMaster) {
	var count = 0;
	function processQueue() {
		if(count < numCPUs*2) {
			++count;
			LinkQueue.dequeue(function(link) {
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
					console.log("Done!");
			});
		}
		
	}

	processQueue();
	
} else if(cluster.isWorker) {
	var link = {url : process.env.url, importer : process.env.importer};
	
	DataCollector.getArticle(link, function(err, article) {
		Article.save(article, function() {
			console.log(article.url);
			process.exit(0);
		})
		
	});
}
