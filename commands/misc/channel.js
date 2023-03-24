const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'channel',
    description: 'Set where bot can post messages',
    permissions: PermissionFlagsBits.ManageGuild,
    // devOnly: true,
    // testOnly: true,
    // options: Object[]
    // deleted: Boolean

    callback: async (client, interaction) => {
        const channel = interaction.options.get('channel-name').value;
        // client.channels.set(channel);
        client.channels.cache.get(channel).send('This channel will be used for posting manga updates');
        
        //set in mongodb to set main channel

        await interaction.reply('Set');
    }
}