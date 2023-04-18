//	embed builder and attachment builder are required for uploading images to discord within an embed
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

//	pulling in all the functions we will use for this command
//	consult the WallpaperFunctions file for more information on the individual functions
const { wallpaperFilePicker, wallpaperFileSize, getImageMetadata, getAverageColor, wallpaperSource } = require('../functions/Command/WallpaperFunctions.js');

//	color-convert is used to change the RGB array provided by getAverageColor into a hex code
const convert = require('color-convert');


module.exports = {
	enabled: true,
	guildOnly: false,
	category: 'Miscellaneous',
	data: new SlashCommandBuilder()
		.setName('wallpaper')
		.setDescription('responds with a random wallpaper from the database'),
	async execute(interaction) {

		//	Due to the runtime of the functions in this command, we need to defer the reply so the interaction token does not expire
		//	500 miliseconds is enough time to defer the reply, as the time limit for editing a reply is much higher than the inital time to respond
		const wait = require('node:timers/promises').setTimeout;
		await interaction.deferReply();
		await wait(500);

		const WallpaperFile = wallpaperFilePicker();
		//	defines the entire filepath of the image, so i do not have to type out the whole path every time it is used
		const filepath = `./wallpapers/${WallpaperFile}`;


		const metadata = await getImageMetadata(filepath);

		const averageColor = await getAverageColor(filepath);
		const hexColor = convert.rgb.hex(averageColor);
		console.log(hexColor);

		const result = await wallpaperSource(filepath);
		console.log(result);


		//	attachmentBuilder uploads the file to be used, instead of a URL
		//	we set the name to a generic "UploadedFile" to account for any photos that may have spaces in the original name
		//	as the attachment builder does not work properly with files that have spaces in the filename
		//	AND I'M NOT BOTHERING TO PROPERLY SANITIZE FOR SPACES IN FILE NAMES RIGHT NOW. THEY GET RENAMED
		const EditedFileName = `UploadedFile.${metadata.FileTypeExtension}`;
		const AttachmentFile = new AttachmentBuilder(filepath).setName(EditedFileName);
		const imageSize = wallpaperFileSize(filepath);

		//	consult discord.js guide docs for further information related to embed builders: https://discordjs.guide/popular-topics/embeds.html
		const WallpaperEmbed = new EmbedBuilder()
			.setTitle(WallpaperFile)
			.setColor(averageColor)
			.addFields(
				{ name: 'Source', value: result.raw.data.source ?? result.url, inline: false },
				{ name: 'Source Accuracy', value: `${result.raw.data.similarity ?? result.similarity}%`, inline: true },
				//	{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Resolution', value: metadata.ImageSize, inline: true },
				{ name: 'Average color', value: `#${hexColor}`, inline: true },
			)
			.setImage(`attachment://${EditedFileName}`)
			.setTimestamp();


		//	temporarily creating a second embed for when a file is too big to upload. This will be removed when the images are hosted on a web server
		const wallpaperTooBig = new EmbedBuilder()
			.setTitle(WallpaperFile)
			.setDescription('Due to the size of the image, it has not been uploaded to discord within this embed. All metadata for the image is still accessible at the site:')
			.setColor(averageColor)
			.addFields(
				{ name: 'The Problem:', value: `Discord limits the file size a bot can upload. It is the same as a free user, so 8 MB at max. The image the bot returned was ${imageSize}MB in size.` },
			)
			.addFields(
				{ name: 'Resolution', value: metadata.ImageSize, inline: true },
				{ name: 'Average color', value: `#${hexColor}`, inline: true },
			)
			.setTimestamp();

		//	8MB is max file size for uploads currently, so anything larger than that wil not embed
		if (imageSize > 8) {
			await interaction.editReply({ embeds: [wallpaperTooBig] });
		}
		else {
			await interaction.editReply({ embeds: [WallpaperEmbed], files: [AttachmentFile] });
		}
	},
};