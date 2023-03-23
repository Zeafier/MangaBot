const { request, selected } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType, ComponentType } = require('discord.js');
const addMangaToDb = require('../../database/callbacks/addNewManga');
const getMangaList = require('../../utils/getMangaList');
const isNumber = require('../../utils/isNumber');
const previewBtn = require('../../buttons/preview.Btn');
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
        await interaction.reply({ content: `Waiting`, ephemeral: true });

        let text = interaction.options.get('manga-name').value;

        // Manganato request
        let response = await request(text);

        //get boolean value
        let bool = response[0];
        //get array value
        let manga_info = response[1];

        if (bool === 'found') {
            let response = await addMangaToDb(manga_info);

            if (typeof response !== 'boolean') {
                await interaction.editReply(response)
            } else if (response) {
                await interaction.editReply({ content: `The following has been added to your list:
                Name: ${manga_info.title.main}
                Current Chapter: ${manga_info.chapters[0].name}
                Link: <${manga_info.chapters[0].url}>`, ephemeral: true, components: []});
            } else {
                await interaction.editReply({ content: 'There was a problem with your request. Please try again or contact admin', ephemeral: true });
            }
            
        } else if (bool === 'undefined') {
            await interaction.editReply(manga_info);
        } else {
            // number of manga in list to be displayed
            let current_number = 0;
            let selected;
            let gotResponse = false;

            let replyMessage = `Found ${manga_info.length} records. Please type number which manga you want to choose \n \n`

            await interaction.editReply({
                ephemeral: true,
                content: replyMessage + await getMangaList(current_number, manga_info),
                components: [previewBtn()]
            });

            //get user response
            let filter = msg => msg.author.id === interaction.user.id;
            let button_filet = msg => msg.user.id === interaction.user.id;

            let collector = interaction.channel.createMessageCollector({
                filter,
                time: 60000
            });
            let button_collector = interaction.channel.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 70000 });

            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < manga_info.length) {
                    current_number += 5;

                    i.deferUpdate();

                    interaction.editReply({
                        ephemeral: true,
                        content: replyMessage + await getMangaList(current_number, manga_info),
                        components: [previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;

                    i.deferUpdate();

                    interaction.editReply({
                        ephemeral: true,
                        content: replyMessage + await getMangaList(current_number, manga_info),
                        components: [previewBtn()]
                    });
                }
                //Check if cancelled
                else if (i.customId === 'cancel') {
                    collector.stop();
                }
                //ignore other request
                else {
                    i.deferUpdate();
                }
            })

            //check all of the messages in collector
            for await (const msg of collector) {
                let reply = msg[0].content.toLowerCase();

                // check if reply is a number
                if (!isNaN(reply) && isNumber(reply)) {
                    //set selected number
                    selected = parseInt(reply) - 1;

                    //check if selected number is in array
                    if (selected >= 0 && selected < manga_info.length) {

                        let response = await addMangaToDb(manga_info[selected]);

                        if (typeof response !== 'boolean') {
                            collector.stop();
                        } else if (response) {
                            gotResponse = true;
                            collector.stop();
                        } else {
                            collector.stop();
                        }
                    } else {
                        collector.stop();
                    }
                }
                else {
                    collector.stop();
                }
            }

            //check if got response
            if (gotResponse) {
                await interaction.deleteReply();
                await interaction.followUp({ content: `The following has been added to your list:
                            Name: ${manga_info[selected].title.main}
                            Current Chapter: ${manga_info[selected].chapters[0].name}
                            Link: <${manga_info[selected].chapters[0].url}>`, ephemeral: true, components: []});
            } else {
                button_collector.stop();
                await interaction.deleteReply();
                await interaction.followUp({ephemeral: true, content: 'Request has been cancelled 🙂'})
            }
            
        }
    }
}