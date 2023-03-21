const { request, selected } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'add-manga',
    description: 'Add which manga you want to get posts on',
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

        //get boolean value
        let bool = response[0];
        //get array value
        let manga_info = response[1];

        if(bool) {
            interaction.editReply(`The following has been added to your list:
                Name: ${text}
                Current Chapter: ${manga_info.name}
                Link: <${manga_info.url}>
            `)
        } else {
            interaction.editReply(manga_info);
        }
    }
}