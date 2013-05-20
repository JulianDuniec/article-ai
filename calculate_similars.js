var LinkQueue = require('./src/data-access/LinkQueue');
var DataCollector = require('./src/data-collection/DataCollector');
var Article = require('./src/data-access/Article');
var cluster = require('cluster');
var ngram = require('./src/similarity/ngram');

function sortAndCap(obj, top) {
	var res = [];
	var count = 0;
	for(key in obj) {
		res.push({k : key, v : obj[key]});
	}
	res.sort(function(a, b) {
		return a.v > b.v ? -1 : (a.v == b.v ? 0 : 1);
	});

	res =  res.splice(0, top);
	var r = {};
	res.forEach(function(i) {
		r[i.k] = i.v
	});
	return r;
}


Article.getAllArticles(function(articles) {
	Article.loadNgramIndex(function(ngramIndex) {
		for (var i = articles.length - 1; i >= 0; i--) {
			var a = articles[i];
			if(!Article.hasSimilar(a) && Article.hasNgram(a)) {
				var ngrama = Article.loadNgramSync(a);
				if(Object.keys(ngrama).length > 10) {
					var asimilar = {};
					for (var j = articles.length - 1; j >= 0; j--) {
						var b = articles[j];
						if(Article.hasNgram(b) && i != j) {
							var ngramb = Article.loadNgramSync(b);
							if(Object.keys(ngramb).length > 10) {
								var similarity = ngram.similarity(ngrama, ngramb, ngramIndex);
								asimilar[b] = similarity;
								if(similarity>2) {
									var a1 = Article.loadSync(a);
									var b1 = Article.loadSync(b);
									console.log(a1.url, b1.url, similarity);
									console.log(a1.headline, b1.headline, similarity);
								}
									
							}
						}
					};
					Article.saveSimilarsSync(a, sortAndCap(asimilar, 30));
				}
				
			}
		};
	})
});