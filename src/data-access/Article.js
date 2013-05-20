var crypto = require('crypto');
var fs = require('fs');
var _ = require('underscore');

module.exports = {
	getFileName : function(url) {
		var md5sum = crypto.createHash('md5');
		md5sum.update(url);
		return __dirname + '/../../_data/articles/' + md5sum.digest('hex');
	},

	save : function(article, callback) {
		var filename = this.getFileName(article.url);
		fs.writeFile(filename, JSON.stringify(article), callback); 
	},

	saveNgramIndex : function(grams, callback) {
		var filename = __dirname + '/../../_data/ngrams/index.txt';
		if(fs.existsSync(filename))
			fs.unlinkSync(filename);
		fs.writeFile(filename, JSON.stringify(grams), callback); 
	},

	saveSimilarsSync : function(article, similars) {
		var filename = __dirname + '/../../_data/similars/' + article;
		if(fs.existsSync(filename))
			fs.unlinkSync(filename);
		fs.writeFileSync(filename, JSON.stringify(similars));
	},

	load : function(id, callback) {
		fs.readFile(__dirname + '/../../_data/articles/' + id, 'utf8', function(err, file) {
			callback(JSON.parse(file));
		});
	},
	loadSync : function(id) {
		var d = fs.readFileSync(__dirname + '/../../_data/articles/' + id, 'utf8');
		return JSON.parse(d);
	},

	loadNgram : function(id, callback) {
		fs.readFile(__dirname + '/../../_data/ngrams/' + id, 'utf8', function(err, file) {
			if(err) callback(null)
			else callback(JSON.parse(file));
		});
	},

	loadNgramIndex : function(callback) {
		fs.readFile(__dirname + '/../../_data/ngrams/index.txt', 'utf8', function(err, file) {
			if(err) callback(null);
			else callback(JSON.parse(file));
		});
	},

	loadNgramSync : function(id) {
		var d = fs.readFileSync(__dirname + '/../../_data/ngrams/' + id, 'utf8');
		return JSON.parse(d);
	},

	getAllArticles : function(callback) {
		fs.readdir(__dirname + '/../../_data/articles', function(err, files) {
			callback(_.filter(files, function(file) {
				return file.length == 32;
			}));
		});
	},

	saveNgram : function(article, ngram, callback) {
		fs.writeFile(__dirname + '/../../_data/ngrams/' + article, JSON.stringify(ngram), function(err) {
			callback(err);
		}); 
	},

	getArticlesWithoutNGram : function(callback) {
		var me = this;
		this.getAllArticles(function(files) {
			callback(_.filter(files, function(file) {
				return (!me.hasNgram(file))
			}));
		});	
	},

	hasNgram : function(article) {
		return fs.existsSync(__dirname + '/../../_data/ngrams/'+article);
	},

	hasSimilar : function(article) {
		return fs.existsSync(__dirname + '/../../_data/similars/'+article);
	},

	getArticlesWithoutSimilars : function(callback) {
		var me = this;
		this.getAllArticles(function(files) {
			callback(_.filter(files, function(file) {
				return (!me.hasSimilar(file))
			}));
		});
	}
}