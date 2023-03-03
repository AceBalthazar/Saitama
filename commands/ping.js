const { SlashCommandBuilder } = require('discord.js');
//	This is required at the start of every individual command
//	it allows us to use the slash command functionality of discord.js

//	VERY simple ping command, essentially used to test Client's connection to discord
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};