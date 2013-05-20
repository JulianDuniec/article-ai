var
	_ = require('underscore'),
	Scraper = require('scraper');

module.exports = {
	_id : 'SydsvenskanImporter',
	fetchLinks : function(callback) {
		try {
			var links = [];
				
			Scraper("http://www.sydsvenskan.se/", function(err, query) {
				query('.news_item a, h2 a').each(function() {
					var href = query(this).attr('href');
					if(href.indexOf('/') == 0)
						href = "http://www.sydsvenskan.se" + href;
					if(!_.contains(links, href))
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
						var date = query('.toolbar .date').html();


						callback(null, {
							headline : query('h1').html(),
							pubdate : date != null ? me.parseDate(date) : null,
							body : query('.bodyText').html(),
							lead : query('.lead').html()
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
		var day = split[1];
		var month = this.getMonthNumber(split[2]);
		
		var year = split[3];
		var hour = split[4].split('.')[0];
		var minute = split[4].split('.')[1];
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
