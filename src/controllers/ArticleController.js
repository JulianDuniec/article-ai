var Article = require('../models/Article');
var ObjectId = require('mongodb').ObjectID;
module.exports = {
	get_index_id : function(req, res, id) {
		Article.find({"similar.similarity" : {$gt : 1}}, function(err, articles) {
			articles.sort({"pubdate" : 1}).toArray(function(err, articles) {
				Article.findOne({_id : new ObjectId(id)}, function(err, article) {
					res.render('article', {
						article : article,
						articles : articles
					});
				})
			})
		})
		

	}
};