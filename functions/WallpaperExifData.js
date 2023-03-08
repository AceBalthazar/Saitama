const exif = require('exiftool');
const fs = require('fs');


fs.readFile('', function(err, data) {
	if (err) {throw err;}
	else {
		exif.metadata(data, function(err, metadata) {
			if (err) {
				throw err;
			}
			else {
				console.log(metadata);
			}
		});
	}
});