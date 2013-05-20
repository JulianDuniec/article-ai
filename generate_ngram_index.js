var LinkQueue = require('./src/data-access/LinkQueue');
var DataCollector = require('./src/data-collection/DataCollector');
var Article = require('./src/data-access/Article');
var cluster = require('cluster');
var ngram = require('./src/similarity/ngram');


var aggregate = {};
Article.getAllArticles(function(articles) {
	articles.forEach(function(article) {
		try {
			var gram = Article.loadNgramSync(article);
			ngram.merge(gram, aggregate);
		} catch(ex) {
			console.log(ex);
		}
	});
	aggregate = ngram.compress(aggregate, 4069, 0.05);
	Article.saveNgramIndex(aggregate, function(err) {
		console.log("Done!");
	});
})