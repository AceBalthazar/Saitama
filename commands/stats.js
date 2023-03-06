const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('information about the bot'),
	async execute(interaction) {

		const StatisticsEmbed = new EmbedBuilder()
			.setTitle('Bot Statistics')
			.setColor('Blurple')
			.addFields({ name: 'RAM Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` })
			.addFields(
				{ name: 'Discord.js version', value: version, inline: true },
				{ name: 'Node.js version', value: process.version, inline: true },
			)
			.addFields(
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Server count', value: 'value here', inline: true },
				{ name: 'User count', value: 'value here', inline: true },
			)
			.setTimestamp();

		await interaction.reply({ embeds: [StatisticsEmbed] });

	},

};
