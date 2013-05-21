module.exports = {
	clean : function(article) {
		for(key in article) {
			var content = article[key];
			if(typeof(content) == 'string') {
				content = content.replace(/(\r\n|\n|\r)/gm,"");
				content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, '');
				content = content.replace(/<nobreakage\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/nobreakage>/gmi, '');
				content = content.replace(/<script.*>.*<.*script>/gmi, ' ');
				content = content.replace(/<[^>]*>/gi, ' ');
				content = content.replace(/  /gmi, ' ');
				article[key] = content;
			}
		}
		return article;
	}
}