const registerNewServer = require('../ready/02registerCommands');
const setServerSettings = require('../../database/server/serverPostingSettings');

module.exports = async (client, guild) => {
    let channels = guild.channels.cache;

    let defaultChannel = '';

    for(const channel of channels.values()) {
        if(channel.type === 0 && defaultChannel === ''){
            defaultChannel = channel.id
        }
    }

    if(defaultChannel === ''){
        return console.log('No text channels found');
    }

    try {
        let channel = guild.channels.cache.find(t=> t.id === defaultChannel);

        await channel.send('Hi there 🙂! Please give me a moment so I can finish installations.');

        await (registerNewServer(client, guild, guild.id));

        await setServerSettings(guild.id, defaultChannel);

        await channel.send('I am ready to be used now 🙂. Please set channel where you want me post using /channel <channel name> command');
    } catch (error) {
        console.log(error)
    }
    
}