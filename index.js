//	Node's native FileSystem module, needed for command handling. You can read more here: https://nodejs.org/api/fs.html
const fs = require('node:fs');
//	PATH is needed for command handling. You can read more here: https://nodejs.org/api/path.html
const path = require('node:path');
//	Requiring needed discord.js classes used in the index file
const { Client, Collection, GatewayIntentBits } = require('discord.js');
//	dotenv is used to store environment variables that are used throughout the program. can call these variables with 'process.env.VARIABLE_NAME'
require('dotenv').config();


// Create a new client instance for Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


//	The following points to the directory that holds all application events, and uses fs to filter out everything but Javascript files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


//	This attaches a "commands" property to the client so commands are accessible in other files
client.commands = new Collection();

//	the following points to the directory that holds all bot commands, and uses fs to filter out everything but JavaScript files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//	Checks commands to ensure they have at least the data and execute properties
//	This helps to prevent errors resulting from loading empty, unfinished or otherwise incorrect command files
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


client.login(process.env.DISCORD_TOKEN);