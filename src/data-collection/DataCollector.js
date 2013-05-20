var ArticleCleaner = require('./ArticleCleaner');

module.exports = {
	importers : [
		require('./importers/AftonbladetImporter'),
		require('./importers/DNImporter'),
		require('./importers/SVDImporter'),
		require('./importers/SVTImporter'),
		require('./importers/SydsvenskanImporter')
	],

	getLinks : function(onLink, onComplete) {
		var open = 0;
		this.importers.forEach(function(importer) {
			++open;
			importer.fetchLinks(function(err, links) {
				var id = this._id;
				if(!err)
					links.forEach(function(link) {
						onLink(link, id);
					})
				if(--open == 0)
					onComplete();
			}.bind(importer))
		});
	},

	getImporter : function(id) {
		for (var i = this.importers.length - 1; i >= 0; i--) {
			var importer = this.importers[i];
			if(importer._id == id)
				return importer;
		};
		return null;
	},

	getArticle : function(link, callback) {
		this.getImporter(link.importer).importArticle(link.url, function(err, article) {
			article = article || {};
			article.url = link.url;
			article.importer = link.importer;
			article = ArticleCleaner.clean(article);
			callback(err, article);
		});
	}
}