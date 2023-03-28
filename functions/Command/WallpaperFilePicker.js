//	This file returns a random wallpaper from the wallpaper repository folder as a variable "chosenFile"
//	This is very rudimentary currently and semi-on purpose as I don't currently need any
//	RNG protection on duplicate files, as that shouldn't realistically matter in the long term.
//	Using FS, I simply point at the directory that holds the images and use math.random() to pull one from the stack

//	TODO: set a filter so this will only return photo filetypes compatible with discord, like .png and .jpg
//	This would also prevent the embeds from breaking due to incorrect file type. Current solution is only put .png's into the folder.

//	TODO: rework how this file is formatted to match the syntax of other functions used by the bot.


const fs = require('fs');
const path = require('node:path');

module.exports.chosenFile = function() {
	const wallpaperPath = path.join(__dirname, '../../wallpapers');
	const wallpaperFiles = fs.readdirSync(wallpaperPath);
	const chosenFile = wallpaperFiles[Math.floor(Math.random() * wallpaperFiles.length)];
	return chosenFile;
};
