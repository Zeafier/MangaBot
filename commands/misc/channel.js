const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const dbServerSettings = require('../../database/server/serverPostingSettings');

module.exports = {
    name: 'channel',
    description: 'Set where bot can post messages',
    permissions: PermissionFlagsBits.ManageGuild,
    // devOnly: true,
    // testOnly: true,
    options: [
        {
            name: 'channel-name',
            description: 'Select channel',
            required: true,
            type: ApplicationCommandOptionType.Channel
        }
    ],
    // deleted: Boolean

    callback: async (client, interaction) => {
        const channel = interaction.options.get('channel-name').value;
        const current_server = interaction.guild.id;
        
        const response = await dbServerSettings(current_server, channel);

        if (response) {
            client.channels.cache.get(channel).send('This channel will be used for posting manga updates');
            //set in mongodb to set main channel

            await interaction.reply('Selected channel has been set as main posting channel');
        }else{
            await interaction.reply('Something went wrong');
        }
    }
}