const express = require('express');
const PORT = process.env.PORT || 5050;
const app = express();
const bot = require('./bot/bot_commands');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv/config');


//bot setup
const client = new Client ({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
client.login(process.env.TOKEN)

app.listen(PORT, () => {
    console.log(`App is running on ${PORT} port`);
    // run bot
    bot(client);
})