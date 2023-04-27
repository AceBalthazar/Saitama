const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');

module.exports = {
	config: {
		enabled: true,
		guildOnly: false,
		permlevel: 'User',
		category: 'Miscellaneous',
		usage: '/stats',
	},
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
				{ name: 'Number of Commands', value: interaction.client.commands.size.toLocaleString() },
				{ name: 'Server count', value: interaction.client.guilds.cache.size.toLocaleString(), inline: true },
				{ name: 'User count', value: interaction.client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString(), inline: true },
			)
			.setTimestamp();

		await interaction.reply({ embeds: [StatisticsEmbed] });

	},

};
