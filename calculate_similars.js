var db = require('./src/models/db');
var Article = require('./src/models/Article');
var NGramIndex = require('./src/models/NGramIndex');
var ngram = require('./src/similarity/ngram');
var _ = require('underscore');

function sortAndCap(arr, top) {
	
	arr.sort(function(a, b) {
		return a.similarity > b.similarity ? -1 : (a.similarity == b.similarity ? 0 : 1);
	});

	return arr.splice(0, top);
}

db.start(function() {
	NGramIndex.findOne({}, function(err, index) {
		Article.find({ngram : {$ne : null}, ngram : {$exists : true}}, function(err, articles) {
			articles = articles.toArray(function(err, articles) {
				var changes = [];
				var len = articles.length;
				for (var i = 0; i < len; i++) {
					console.log(i, "of", len);
					var a = articles[i];
					if(a.similar != null)
						continue;
					
					if(Object.keys(a.ngram).length > 10) {
						for (var j = i+1; j < len; j++) {
							var b = articles[j];
							if(b.similar == null)
								b.similar = [];
							if(Object.keys(b.ngram).length > 10) {
								var similarity = ngram.similarity(a.ngram, b.ngram, index.index);
								a.similar.push({_id: b._id, similarity : similarity, headline : b.headline, url : b.url});
								b.similar.push({_id: a._id, similarity : similarity, headline : a.headline, url : a.url});
								changes.push(a);
								changes.push(b);
							}
						}
					}
					
				}
				if(changes.length == 0)
					db.stop();
				var started = 0;
				changes.forEach(function(article) {
					article.similar = sortAndCap(article.similar, 20);
					++started;
					Article.save(article, function() {
						console.log("Saved", started);
						if(--started == 0)
							db.stop();
					});
				})
			});
			
		});
	});
	
});
