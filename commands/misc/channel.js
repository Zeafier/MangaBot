const { PermissionFlagsBits, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const dbServerSettings = require('../../database/server/serverPostingSettings');

module.exports = {
    name: 'channel',
    description: 'Set channel for manga posting - required permission',
    permissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: 'channel-name',
            description: 'Select channel for posting',
            required: true,
            type: ApplicationCommandOptionType.Channel
        }
    ],
    // deleted: Boolean

    callback: async (client, interaction) => {
        const channel = interaction.options.get('channel-name').value;
        const current_server = interaction.guild.id;
        const member = interaction.member;

        // Limit who can use this command - Manage channels permission requires 
        if(!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ephemeral: true, content: "You are not allowed to use this command. Please talk with channel moderator"});
        }
        
        const response = await dbServerSettings(current_server, channel);

        if (response) {
            await client.channels.cache.get(channel).send({ephemeral: true, content: 'This channel will be used for posting manga updates'});
            //set in mongodb to set main channel

            await interaction.reply({ephemeral: true, content: 'Selected channel has been set as main posting channel'});
        }else{
            await interaction.reply({ephemeral: true, content: 'Something went wrong'});
        }
    }
}