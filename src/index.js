const express = require('express');
const app = express();
const bot = require('../bot/bot_commands');
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('../handlers/eventHandler');

app.disable('x-powered-by');
app.set('trust proxy', 1);

//run db
require('../database/db');

//enable app to read env files
require('dotenv').config();

//run db
// require('./config/db');

//discord bot setup
const client = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent
    ]
});

eventHandler(client)

client.login(process.env.TOKEN);