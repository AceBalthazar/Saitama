const ColorThief = require('colorthief');

function getAverageColor(filepath) {
	return ColorThief.getColor(filepath);
}

function getColorPalette(filepath) {
	return ColorThief.getPalette(filepath, 10);
}

module.exports = {
	getAverageColor, getColorPalette,
};