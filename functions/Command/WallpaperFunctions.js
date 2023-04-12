const fs = require('fs');
const path = require('node:path');
const exiftool = require('exiftool-vendored').exiftool;
const ColorThief = require('colorthief');

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

function getImageMetadata(filepath) {
	return exiftool.read(filepath);
}

function getAverageColor(filepath) {
	return ColorThief.getColor(filepath);
}

function getColorPalette(filepath) {
	return ColorThief.getPalette(filepath, 10);
}

module.exports = {
	wallpaperFilePicker, wallpaperFileSize, getImageMetadata, getAverageColor, getColorPalette,
};