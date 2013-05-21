var Article = require('../data-access/Article');
module.exports = {
	get_index_id : function(req, res, id) {
		Article.getAllArticles(function(articles) {
			Article.load(id, function(article) {
			
				Article.loadSimilars(id, function(similars) {
					res.render('article', {
						article : article,
						similars : similars,
						articles : articles
					});
				});
			})
		});

	}
};