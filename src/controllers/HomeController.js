var Article = require('../data-access/Article');
module.exports = {
	get_index : function(req, res) {
		Article.getAllArticles(function(articles) {
			res.render('index', {
				articles : articles
			});
		});
	}
}