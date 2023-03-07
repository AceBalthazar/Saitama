//	This file returns a random wallpaper from the wallpaper repository folder as a variable "chosenFile"
//	This is very rudimentary currently and semi-on purpose as I don't currently need any
//	RNG protection on duplicate files, as that shouldn't realistically matter in the long term.
const fs = require('fs');
const path = require('node:path');

module.exports.chosenFile = function() {
	const wallpaperPath = path.join(__dirname, '../wallpapers');
	const wallpaperFiles = fs.readdirSync(wallpaperPath);
	const chosenFile = wallpaperFiles[Math.floor(Math.random() * wallpaperFiles.length)];
	return chosenFile;
};
