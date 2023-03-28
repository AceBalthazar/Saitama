// We're using the singleton here for convenience:
const exiftool = require('exiftool-vendored').exiftool;


function getImageMetadata(imagePath) {
	return exiftool.read(imagePath);
}

module.exports = {
	getImageMetadata,
};