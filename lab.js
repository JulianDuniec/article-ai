var ArticleOld = require('./src/data-access/Article');
var Article = require('./src/models/Article');
var db = require('./src/models/db');
var _ = require('underscore')
db.start(function() {

	Article.find({}, function(err, articles) {
		articles.toArray(function(err, articles) {
			var started = 0;
			articles.forEach(function(article) {
				var unique = _.uniq(article.similar, false, function(a) {
					return a._id.toString();
				});
				if(unique.length != article.similar.length) {
					article.similar = unique;
					++started;
					Article.save(article, function() {
						if(--started == 0)
							db.stop();
					});
				}
				console.log(unique.length, article.similar.length);
			})
			if(started == 0)
				db.stop();
		})
	});
})