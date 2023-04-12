//	TODO: Need to account for images that are larger than 8 MB, as the bot will be unable to embed them if they are
//	embed builder and attachment builder are required for uploading images to discord within an embed
//	ImageMetadata and AverageColor are used to flesh out the embed with more information related to the image, such as resolution and the average color
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { wallpaperFilePicker, wallpaperFileSize, getImageMetadata, getAverageColor } = require('../functions/Command/WallpaperFunctions.js');
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


		//	chosenFile function will be re-written in the future, may need to change code here to account for rewrite
		const WallpaperFile = wallpaperFilePicker();
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
		const hexColor = convert.rgb.hex(averageColor);
		console.log(hexColor);

		//	attachmentBuilder uploads the file to be used, instead of a URL
		//	we set the name to a generic "UploadedFile" to account for any photos that may have spaces in the original name
		//	as the attachment builder does not work properly with files that have spaces in the filename
		//	AND I'M NOT BOTHERING TO PROPERLY SANITIZE FOR SPACES IN FILE NAMES RIGHT NOW. THEY GET RENAMED
		const EditedFileName = `UploadedFile.${metadata.FileTypeExtension}`;
		const AttachmentFile = new AttachmentBuilder(filepath).setName(EditedFileName);
		//	console.log(AttachmentFile);

		const imageSize = wallpaperFileSize(filepath);

		//	consult discord.js guide docs for further information related to embed builders: https://discordjs.guide/popular-topics/embeds.html
		const WallpaperEmbed = new EmbedBuilder()
			.setTitle(WallpaperFile)
			.setColor(averageColor)
			.addFields(
				{ name: 'Resolution', value: metadata.ImageSize, inline: true },
				{ name: 'Average color', value: `#${hexColor}`, inline: true },
			)
			.setImage(`attachment://${EditedFileName}`)
			.setTimestamp();

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


		if (imageSize > 8) {
			await interaction.editReply({ embeds: [wallpaperTooBig] });
		}
		else {
			await interaction.editReply({ embeds: [WallpaperEmbed], files: [AttachmentFile] });
		}
	},
};