var
	_ = require('underscore'),
	Scraper = require('scraper');

module.exports = {
	fetchLinks : function(callback) {
		try {
			var links = [];
				
			Scraper("http://www.svt.se/nyheter/", function(err, query) {
				query('a.svtLink-Discreet-THEMED').each(function() {
					var href = query(this).attr('href');
					if(!_.contains(links, href))
						links.push(href);
				});
				Scraper("http://www.svt.se/sport/", function(err, query) {
					query('a.svtLink-Discreet-THEMED').each(function() {
						var href = query(this).attr('href');
						if(!_.contains(links, href))
							links.push(href);
					});
					Scraper("http://www.svt.se/kultur/", function(err, query) {
						query('a.svtLink-Discreet-THEMED').each(function() {
							var href = query(this).attr('href');
							if(!_.contains(links, href))
								links.push(href);
						});
						Scraper("http://www.svt.se/pejl/", function(err, query) {
							query('a.svtLink-Discreet-THEMED').each(function() {
								var href = query(this).attr('href');
								if(!_.contains(links, href))
									links.push(href);
							});
							callback(null, links);
						});
					});
				});
			});
		} catch (ex) {
			callback(ex);
		}
	},

	importArticle : function(url, callback) {
		try {
			Scraper(url, function(err, query) {
				if(err) callback(err);
				else {
					try {
						var date = query('.meta p.published').html();
						callback(null, {
							headline : query('article h1').html(),
							pubdate : null,
							body : query('article .svtTextBread-Article').html(),
							lead : query('article .svtTextLead-Article').html()
						});
					} 
					catch (ex) {
						callback(ex);
					}
					
				}
					
			});
		} catch (ex) {
			callback(ex);
		}
	}
};
