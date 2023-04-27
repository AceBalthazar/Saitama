const { SlashCommandBuilder } = require('discord.js');

//	TODO: command does not work properly if the cedited file required an option and no longer does, or vice versa. need to look into a fix later
module.exports = {
	config: {
		enabled: true,
		guildOnly: false,
		permlevel: 'Developer',
		category: 'System',
		usage: '/reload [command name]',
	},
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),

	async execute(interaction) {
		if (interaction.user.id !== process.env.developerID) {
			await interaction.reply('You do not have permissions to run this command!');
		}
		else {
			const commandName = interaction.options.getString('command', true).toLowerCase();
			const command = interaction.client.commands.get(commandName);

			if (!command) {
				return interaction.reply(`There is no command with name \`${commandName}\`!`);
			}

			delete require.cache[require.resolve(`./${command.data.name}.js`)];

			try {
				interaction.client.commands.delete(command.data.name);
				const newCommand = require(`./${command.data.name}.js`);
				interaction.client.commands.set(newCommand.data.name, newCommand);
				await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
			}
			catch (error) {
				console.error(error);
				await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
			}
		}
	},

};