const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const chosenFile = require('../functions/Wallpaper_File_Picker.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wallpaper')
		.setDescription('responds with a random wallpaper from the database'),
	async execute(interaction) {
		const WallpaperFile = chosenFile.chosenFile();

		console.log(WallpaperFile);

		const file = new AttachmentBuilder(`./wallpapers/${WallpaperFile}`);

		const WallpaperEmbed = new EmbedBuilder()
			.setTitle(WallpaperFile)
			.setColor('Blurple')
			.setImage(`attachment://${WallpaperFile}`)
			.setTimestamp();


		await interaction.reply({ embeds: [WallpaperEmbed], files: [file] });
	},
};