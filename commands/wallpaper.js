const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const chosenFile = require('../functions/WallpaperFilePicker.js');
const { getImageMetadata } = require('../functions/WallpaperExifData.js');
const { getAverageColor } = require('../functions/WallpaperColorThief.js');
//	TODO: Need to account for images that are larger than 8 MB, as the bot will be unable to embed them if they are
module.exports = {
	data: new SlashCommandBuilder()
		.setName('wallpaper')
		.setDescription('responds with a random wallpaper from the database'),
	async execute(interaction) {
		const WallpaperFile = chosenFile.chosenFile();
		const filepath = `./wallpapers/${WallpaperFile}`;


		const metadata = await getImageMetadata(filepath);
		//	console.log(metadata);


		const averageColor = await getAverageColor(filepath);
		//	console.log(averageColor);


		const file = new AttachmentBuilder(filepath);
		const WallpaperEmbed = new EmbedBuilder()
			.setTitle(WallpaperFile)
			.setColor(averageColor)
			.addFields(
				{ name: 'Resolution', value: metadata.ImageSize },
			)
			.setImage(`attachment://${WallpaperFile}`)
			.setTimestamp();


		await interaction.reply({ embeds: [WallpaperEmbed], files: [file] });
	},
};