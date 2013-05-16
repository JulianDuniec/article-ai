var
	Scraper = require('scraper');

module.exports = {
	fetchLinks : function(callback) {
		try {
			Scraper("http://www.dn.se", function(err, query) {
			
				var links = [];
				query('.teaser h3 a, .teaser h2 a, .teaser h4 a, .teaser h5 a').each(function() {
					var href = query(this).attr('href');
					if(href.indexOf('/') == 0)
						href = "http://www.dn.se" + href;
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
				else {
					try {
						var date = query('#article-content p.published').html();
						if(date != null) {
							if(date.indexOf('i dag') != -1) {
								var hourMatch = date.match(/[0-9][0-9]:[0-9][0-9]/)[0];
								date = new Date();
								date.setHours(parseFloat(hourMatch.split(':')[0]));
								date.setMinutes(parseFloat(hourMatch.split(':')[1]));
							}
							else {
								var matches = date.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]/gi);
								console.log(matches.length);
								if(matches.length > 0)
									date = matches[0];
							}
						}
						
						
						callback(null, {
							headline : query('#article-content h1').html(),
							pubdate : date,
							body : query('#article-content .content-body').html(),
							lead : query('#article-content .preamble').html()
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