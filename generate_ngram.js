var Article = require('./src/models/Article');
var db = require('./src/models/db');
var cluster = require('cluster');
var ngram = require('./src/similarity/ngram');
var numCPUs = require('os').cpus().length;



if(cluster.isMaster) {
	db.start(function() {
		Article.find({ngram : null}, function(err, articles) {
			var count = 0;
			function processQueue() {
				if(count < numCPUs * 2) {
					++count;
					articles.nextObject(function(err, article) {
						if(article == null)
						{
							db.stop();
							return;
						}	
						var worker = cluster.fork({
								url : article.url
							});
						worker.on('exit', function() {
							count -= 1;
							console.log("Process exited", count);
							if(count == 0)
								db.stop();
							processQueue();
						});
						processQueue();
					});					
				}
			}

			processQueue();
		});
	});
} else if(cluster.isWorker) {
	var url = process.env.url;
	db.start(function() {
		Article.findOne({url : url}, function(err, article) {
			var corpus = (article.headline || "") + " "
							+ (article.lead || "") + " "
							+ (article.body || "");
			corpus = corpus.replace(/[&\/\\#,+()$~%.'":*?<>-_{}]/g,' ');
			corpus = corpus.replace(/\n/g, '');
			corpus = corpus.replace(/\r/g, '');
			corpus = corpus.replace('  ', ' ');
			article.ngram = ngram.create(corpus, 4);
			Article.save(article, function() {
				console.log(arguments);
				process.exit(1);
			});
		});
	});
	
}
