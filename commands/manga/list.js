const { request, selected } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType } = require('discord.js')

//will be used for reading list
module.exports = {
    name: 'list-manga',
    description: 'Display your current reading list',
    options: [
        {
            name: 'manga-name',
            description: 'Please provide manga name',
            type: ApplicationCommandOptionType.String,
        }
    ],

    callback: async (client, interaction) => {
        interaction.reply('Waiting...');
        let text = interaction.options.get('manga-name').value;;

        // Manganato request
        let response = await request(text);

        //get array value
        let manga_info = response[1];
        interaction.editReply(manga_info)
    }
}