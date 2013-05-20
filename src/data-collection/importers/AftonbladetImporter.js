var 
	Scraper = require('scraper');

module.exports = {
	_id : 'AftonbladetImporter',

	fetchLinks : function(callback) {
		try {
			Scraper('http://www.aftonbladet.se/', function(err, query) {
				var links = [];
				query('a.abBlock').each(function() {
					var href = query(this).attr('href');
					if(href.indexOf('article') != -1)
						links.push(href);
				});
				callback(null, links);
			});
		} catch (ex) {
			callback(ex);
		}
	},
	importArticle : function(url, callback) {
		try {
			Scraper(url, function(err, query) {
				if(err) callback(err);
				else
					callback(null, {
						headline : query('article h1, article h2').html(),
						pubdate : query('time[pubdate]').attr('datetime'),
						body : query('#abBodyText').html(),
						lead : query('article .abLeadText').html()
					});
			});
		} catch (ex) {
			callback(ex);
		}
		
	}
};