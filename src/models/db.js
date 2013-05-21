var mongodb = require('mongodb');

module.exports = {
	start : function(callback) {
		var server = new mongodb.Server('127.0.0.1', 27017, {});
		var me = this;
		new mongodb.Db('article-ai', server, {w : 1}).open(function(error, client) {
			me.client = client;
			callback();
		});
	},

	stop : function() {
		this.client.close();
	},

	collection : function(name, callback) {
		return new mongodb.Collection(this.client, name);
	}
};