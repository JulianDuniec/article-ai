var db = require('./db');

module.exports = {
	save : function(index, callback) {
		db.collection('ngram_index').insert({index : index, date : new Date()}, callback);
	},

	findOne : function(query, callback) {
		db.collection('ngram_index').findOne(query, callback);
	}
};