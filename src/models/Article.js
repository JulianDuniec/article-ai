var db = require('./db');
module.exports = {
	save : function(article, callback) {
		db.collection('articles').update({url : article.url}, article, {upsert : true}, callback);
	},

	find : function(query, callback) {
		db.collection('articles').find(query, callback);
	},

	findOne : function(query, callback) {
		db.collection('articles').findOne(query, callback);
	},
};