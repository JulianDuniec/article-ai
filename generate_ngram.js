var LinkQueue = require('./src/data-access/LinkQueue');
var DataCollector = require('./src/data-collection/DataCollector');
var Article = require('./src/data-access/Article');
var cluster = require('cluster');
var ngram = require('./src/similarity/ngram');



if(cluster.isMaster) {
	
	Article.getArticlesWithoutNGram(function(articles) {
		var count = 0;
		console.log(articles);
		function processQueue() {
			if(count < 20 && articles.length > 0) {
				++count;
				var article = articles.pop();
				var worker = cluster.fork({
						articleId : article
					});
				worker.on('exit', function() {
					count -= 1;
					console.log("Process exited", count);
					processQueue();
				});
				processQueue();
			}
		}

		processQueue();
	});
	
	
} else if(cluster.isWorker) {
	var articleId = process.env.articleId;
	Article.load(articleId, function(article) {
		var corpus = (article.headline || "") + " "
						+ (article.lead || "") + " "
						+ (article.body || "");
		corpus = corpus.replace(/[&\/\\#,+()$~%.'":*?<>-_{}]/g,' ');
		corpus = corpus.replace(/\n/g, '');
		corpus = corpus.replace(/\r/g, '');
		corpus = corpus.replace('  ', ' ');
		var n = ngram.create(corpus, 4);
		Article.saveNgram(articleId, n, function() {
			process.exit(1);
		});
	});
}
