
var importer = require('./src/data-collection/importers/SVDImporter');
var cleaner = require('./src/data-collection/ArticleCleaner');
importer.importArticle('http://www.svd.se/naringsliv/nyheter/sverige/regeringen-jan-ake-jonsson-bor-ta-time-out_8194662.svd', function(err, a) {
	console.log(cleaner.clean(a));
})