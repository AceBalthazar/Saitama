//	fs and path are required for choosing a file at random
//	and finding the size of said file
const fs = require('fs');
const path = require('node:path');
//	exiftool gives us the metadata for the image
const exiftool = require('exiftool-vendored').exiftool;
const ColorThief = require('colorthief');
const sagiri = require('sagiri');
const sagiriClient = sagiri(process.env.SauceNaoAPI);


function wallpaperFilePicker() {
	const wallpaperPath = path.join(__dirname, '../../wallpapers');
	const wallpaperFiles = fs.readdirSync(wallpaperPath);
	const chosenFile = wallpaperFiles[Math.floor(Math.random() * wallpaperFiles.length)];
	return chosenFile;
}

function wallpaperFileSize(filepath) {
	const imageStats = fs.statSync(filepath);

	const fileSizeInBytes = imageStats.size;
	const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
	const fileSizeInMegabytesRounded = (fileSizeInMegabytes).toFixed(2);
	return fileSizeInMegabytesRounded;
}


//	grabs full EXIF Metadata of the selected image
//	consult the exiftool-vendored and exiftool sites for more info related to available metadata: https://github.com/ikmolbo/exiftool-vendored
function getImageMetadata(filepath) {
	return exiftool.read(filepath);
}

//	the following two functions return the average color, and color palette, of the image
//	consult Lokesh Dhakar's site for more information about color thief:  https://lokeshdhakar.com/projects/color-thief/
function getAverageColor(filepath) {
	return ColorThief.getColor(filepath);
}

function getColorPalette(filepath) {
	return ColorThief.getPalette(filepath, 10);
}

function wallpaperSource(filepath) {
	return sagiriClient(filepath).then(res => {
		const result = res[0];
		return result;
	});
}

//	exporting all the functions so we can use them as needed
module.exports = {
	wallpaperFilePicker, wallpaperFileSize, getImageMetadata, getAverageColor, getColorPalette, wallpaperSource,
};