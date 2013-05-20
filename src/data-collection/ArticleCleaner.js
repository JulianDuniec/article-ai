module.exports = {
	clean : function(article) {
		for(key in article) {
			var content = article[key];
			if(typeof(content) == 'string') {
				content = content.replace(/<script.*>.*<.*script>/gi, ' ');
				content = content.replace(/<[^>]*>/gi, ' ');
				content = content.replace('  ', ' ');
				article[key] = content;
			}
		}
		return article;
	}
}