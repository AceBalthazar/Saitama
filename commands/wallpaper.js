//	embed builder and attachment builder are required for uploading images to discord within an embed
//	ImageMetadata and AverageColor are used to flesh out the embed with more information related to the image, such as resolution and the average color
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
		//	chosenFile function will be re-written in the future, may need to change code here to account for rewrite
		const WallpaperFile = chosenFile.chosenFile();
		//	defines the entire filepath of the image, so i do not have to type out the whole path every time it is used
		const filepath = `./wallpapers/${WallpaperFile}`;

		//	grabs full EXIF Metadata of the selected image
		//	consult the exiftool-vendored and exiftool sites for more info related to available metadata: https://github.com/ikmolbo/exiftool-vendored
		const metadata = await getImageMetadata(filepath);
		//	logging to console kept in for testing, commented out for production
		//	console.log(metadata);

		//	grabs average color of the selected image
		//	consult Lokesh Dhakar's site for more information about color thief:  https://lokeshdhakar.com/projects/color-thief/
		const averageColor = await getAverageColor(filepath);
		//	console.log(averageColor);


		const file = new AttachmentBuilder(filepath);
		//	consult discord.js guide docs for further information related to embed builders: https://discordjs.guide/popular-topics/embeds.html
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