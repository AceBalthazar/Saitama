const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const chosenFile = require('../functions/WallpaperFilePicker.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wallpaper')
		.setDescription('responds with a random wallpaper from the database'),
	async execute(interaction) {
		const WallpaperFile = chosenFile.chosenFile();
		const imagepath = `./wallpapers/${WallpaperFile}`;


		const file = new AttachmentBuilder(imagepath);
		const WallpaperEmbed = new EmbedBuilder()
			.setTitle(WallpaperFile)
			.setColor('Blurple')
			.addFields(
				{ name: 'Resolution', value: 'some value' },
			)
			.setImage(`attachment://${WallpaperFile}`)
			.setTimestamp();


		await interaction.reply({ embeds: [WallpaperEmbed], files: [file] });
	},
};