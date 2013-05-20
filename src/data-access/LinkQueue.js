var fs = require('fs');
var exec = require('child_process').exec;
var linkArchiveFile = __dirname + '/../../_data/articles/index.txt';
var Article = require('./Article');

module.exports = {

	enqueue : function(importer, link) {
		if(!fs.existsSync(Article.getFileName(link))) {
			fs.appendFileSync(linkArchiveFile, importer + ' ' + link + '\n');
			console.log("enqueued " + link);
		}
	},

	dequeue : function(callback) {
		var me = this;
		var stream = fs.createReadStream(linkArchiveFile, {
			bufferSize : 200
		});
		var string = "";
		stream
			.on('data', function(data) {
				string += data;
				if(!!~string.indexOf('\n')) {
					stream.pause();
					var link = me._getLink(string.substring(0, string.indexOf('\n')));
					exec('sed -i "" \'1d\' ' + linkArchiveFile, function(err, stdout, stderr) {
						callback(this);
					}.bind(link));
				}
			})
			.on('end', function() {
				callback(me._getLink(string));
			});
	},

	_getLink : function(string) {
		if(string.length == 0)
			return null;
		return {
			importer : string.substring(0, string.indexOf(' ')),
			url : string.substring(string.indexOf(' ')+1)
		}
	}
};