const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	config: {
		enabled: true,
		guildOnly: false,
		permlevel: 'User',
		category: 'System',
		usage: '/help [Command name]',
	},

	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows information about the bot or about particular commands')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to give information about.')
				.setRequired(true)),

	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}
		try {
			const genericHelpEmbed = new EmbedBuilder()
				.setTitle(command.data.name)
				.setColor('Random')
				.setDescription(command.data.description)
				.addFields(
					{ name: 'category:', value: `${command.config.category}` },
					{ name: 'usage:', value: `${command.config.usage}` },
					{ name: 'Guild only:', value: `${command.config.guildOnly}` },
				)
				.setTimestamp();

			await interaction.reply({ embeds: [genericHelpEmbed] });
		}
		catch (error) {
			console.error(error);
			await interaction.reply('something broke, go contact ace balthazar about it.');
		}
	},
};