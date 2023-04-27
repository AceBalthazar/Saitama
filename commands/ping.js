const { SlashCommandBuilder } = require('discord.js');
//	This is required at the start of every individual command
//	it allows us to use the slash command functionality of discord.js

//	VERY simple ping command, essentially used to test Client's connection to discord
module.exports = {
	config: {
		enabled: true,
		guildOnly: false,
		permlevel: 'User',
		category: 'Miscellaneous',
		usage: '/ping',
	},
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('returns the ping of the current bot client'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};