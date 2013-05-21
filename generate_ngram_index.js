var Article = require('./src/models/Article');
var db = require('./src/models/db');
var NGramIndex = require('./src/models/NGramIndex');
var ngram = require('./src/similarity/ngram');

function aggregate(articles, callback, index) {
	index = index || {};

	articles.nextObject(function(err, article) {
		if(article == null) {
			index = ngram.compress(index, 5000, 0.5);
			callback(index);
		} else {
			ngram.merge(article.ngram, index);
			aggregate(articles, callback, index);
		}			
	});
}

db.start(function() {
	Article.find({ngram : {$ne : {}}, ngram : {$exists : true}}, function(err, articles) {
		articles.nextObject(function(err, article) {
			aggregate(articles, function(ngramindex) {
				NGramIndex.save(ngramindex, function() {
					db.stop();
				});
			});	
		});
		
	});	
});
