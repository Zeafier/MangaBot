const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');
require('dotenv').config();
const token = process.env.TOKEN;

const rest = new REST({ version: '10' }).setToken(token);

// ...

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1088800030401499166'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, '1088800030401499166'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);