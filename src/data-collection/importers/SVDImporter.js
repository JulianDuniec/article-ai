var
	Scraper = require('scraper');

module.exports = {
	_id : 'SVDImporter',
	fetchLinks : function(callback) {
		try {
			Scraper("http://www.svd.se", function(err, query) {
			
				var links = [];
				query('.newsarticle h2 a, .news-list ul li a, #more-news li a').each(function() {
					var href = query(this).attr('href');
					if(href != '')
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
			var me = this;
			Scraper(url, function(err, query) {
				if(err) callback(err);
				else {
					try {
						var date = query('.article-metadata span.publishdate')
									.html();
						
						callback(null, {
							headline : query('#article h1').html(),
							pubdate : me.parseDate(date),
							body : query('#article .articlebody').html(),
							lead : query('#article .preamble').html()
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
	},

	parseDate : function(date) {
		var split = date.split(" ");
		var day = split[0];
		var month = this.getMonthNumber(split[1]);
		
		var year = split[2];
		var hour = split[4].split(':')[0];
		var minute = split[4].split(':')[1];
		return new Date(year, 11, day, hour, minute);
	},

	getMonthNumber : function(monthName) {
		switch(monthName) {
			case "december":
				return 12;
			case "november":
				return 11;
			case "oktober":
				return 10;
			case "september":
				return 9;
			case "augusti":
				return 8;
			case "juli":
				return 7;
			case "juni":
				return 6;
			case "maj":
				return 5;
			case "april":
				return 4;
			case "mars":
				return 3;
			case "februari":
				return 2;
			case "januari":
				return 1;
		}
	}
};
