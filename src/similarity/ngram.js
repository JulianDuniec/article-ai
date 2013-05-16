module.exports = {
	create : function(corpus, gramLength, grams) {
		if(!grams)
			grams = {};
			
		if(corpus.length >= gramLength) {
			var gram = corpus.substring(0, gramLength);
			grams[gram] = (grams[gram] || 0) + 1;
			this.create(corpus.substring(1), gramLength, grams)
		}

		return grams;
	},

	merge : function(grams, aggregate) {
		for(gram in grams) {
			aggregate[gram] = (aggregate[gram] || 0) + grams[gram];
		}
		return aggregate;
	},

	compress : function(grams, length, stopRange) {
		var sortable = [];
		for(key in grams) {
			sortable.push({
				k : key,
				v : grams[key]
			});
		}
		sortable.sort(function(a, b) {
			return (b.v-a.v); 
		});
		var stopWordIndex = Math.round(sortable.length * stopRange);
	
		length = stopWordIndex + length;
		var compressed = {};
		for(var i = stopWordIndex; i < length; i++) {
			var item = sortable[i];
			compressed[item.k] = item.v
		}
		return compressed;
	},

	union : function(a, b) {
		var res = {};
		for(key in a) {
			res[key] = a[key];
		}
		for(key in b) {
			res[key] = (res[key] || 0) + b[key];
		}
		return res;
	},

	similarity : function(a, b, referenceTable) {
		var sum = 0;
		for(key in referenceTable) {
			var frequency = referenceTable[key];
			if(a[key] && b[key]) {
				var diff = Math.abs((a[key] || 0)-(b[key] || 0));
				sum += (1/(frequency+1))/(diff + 1);
			}
			
		}
		return sum;
	},

	normalize : function(grams, low, high) {
		var low = low || 0; 
		var high = high || 1;
		var min = Number.MAX_VALUE;
		var max = 0;
		for(key in grams) {
			var v = grams[key];
			if(v < min)
				min = v;
			if(v > max)
				max = v;
		}

		for(key in grams) {
			grams[key] = low + (grams[key] - min) * (high-low) / (max-min);
		}
		
		return grams;
	}
}