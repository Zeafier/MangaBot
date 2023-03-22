const { request, selected } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType } = require('discord.js');
const addMangaToDb = require('../../database/callbacks/addNewManga');
//interaction.server.id //if slash commands - get server id

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
        await interaction.reply('Waiting...');
        let text = interaction.options.get('manga-name').value;

        // Manganato request
        let response = await request(text);

        //get boolean value
        let bool = response[0];
        //get array value
        let manga_info = response[1];

        if(bool === 'found') {
            let response = await addMangaToDb(manga_info);

            if(typeof response !== 'boolean'){
                await interaction.editReply(response);
            }else if(response){
                await interaction.editReply(`The following has been added to your list:
                    Name: ${manga_info.title}
                    Current Chapter: ${manga_info.chapters[0].name}
                    Link: <${manga_info.chapters[0].url}>
                `);
            }else{
                await interaction.editReply('There was a problem with your request. Please try again or contact admin');
            }
            
        } else if(bool === 'undefined') {
            await interaction.editReply(manga_info);
        } else {
            console.log(manga_info);
            await interaction.editReply(`There are ${manga_info.length} manga found with "${text}" name. Please try to more specific or use search`);
        }
    }
}