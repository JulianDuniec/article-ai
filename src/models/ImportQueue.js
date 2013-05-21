var db = require('./db');

module.exports = {

	enqueue : function(importer, url, callback) {
		db.collection('import_queue').findOne({url : url}, function(err, o) {
			if(o == null) {
				db.collection('import_queue').insert({url : url, importer : importer, dequeued : false, date : new Date()}, callback);
			}
			else 
				callback(null);
		});
	},

	dequeue : function(callback) {
		db.collection('import_queue').findAndModify({dequeued : false}, [['date', 'asc']], {$set : {dequeued : true}}, {}, callback);
	}
};