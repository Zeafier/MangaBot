const listEmbed = require('../../components/Embeds/generalListEmbed');
const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Display available commands',

    callback: async (client, interaction) => {

        const title = "List of commands";
        const replyMessage = "Please see below valid bot commands";

        //List of commands:
        const commands = [
            {name: '1. /addmanga <manga name>', value: 'Add manga to your reading list (permission required)'},
            {name: '2. /searchmanga <manga name>', value: 'Search for manga'},
            {name: '3. /showmangalist', value: 'Get server\'s current reading list'},
            {name: '4. /removemanga <manga name>', value: 'Remove manga from server\'s reading list (permissions required)'},
            {name: '5. /channel <channel name>', value: 'Select where bot should post chapters (permissions required)`'}
        ];

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [await listEmbed(title, replyMessage, commands)]
        })
    }
}