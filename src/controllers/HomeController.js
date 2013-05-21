var Article = require('../models/Article');
module.exports = {
	get_index : function(req, res) {
		Article.find({"similar.similarity" : {$gt : 1}}, function(err, articles) {
			articles.sort({"pubdate" : 1}).toArray(function(err, articles) {
				res.render('index', {
					articles : articles
				});
			});
		});
	}
}