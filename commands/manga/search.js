const { request } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType, ComponentType } = require('discord.js');
const previewBtn = require('../../buttons/preview.Btn');
const getMangaList = require('../../utils/getMangaList');

module.exports = {
    name: 'search-manga',
    description: 'Search for manga to be added',
    options: [
        {
            name: 'manga-name',
            description: 'Please provide manga name',
            type: ApplicationCommandOptionType.String,
        }
    ],

    callback: async (client, interaction) => {
        await interaction.reply('Please wait...')
        let text = await interaction.options.get('manga-name').value;

        // Manganato request
        let res = await request(text);
        let type = res[0], manga_list = res[1];

        //Check if there are results
        if (type === "undefined") {
            await interaction.editReply({ content: manga_list, components: [] });
        } else if (type === 'found') {
            await interaction.editReply({ content: `One record has been found:
                Name: ${manga_list.title}
                Link: <${manga_list.url}>`, components: []});
        } else {
            let current_number = 0;
            let max;

            // set max number
            if (current_number + 5 > res.length) {
                max = res.length;
            } else {
                max = current_number + 5;
            }

            let replyMessage = `Found ${res.length} manga with this title. Page ${current_number + 1} - ${max} \n\n`

            //await response
            await interaction.editReply({
                ephemeral: true,
                content: replyMessage + await getMangaList(current_number, manga_list),
                components: [previewBtn()]
            });

            let button_filet = msg => msg.user.id === interaction.user.id;
            let button_collector = interaction.channel.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 60000 });

            //Get collector for the buttons
            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < manga_list.length) {
                    current_number += 5;

                    i.deferUpdate();

                    interaction.editReply({
                        content: replyMessage + await getMangaList(current_number, manga_list),
                        components: [previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;

                    i.deferUpdate();

                    interaction.editReply({
                        content: replyMessage + await getMangaList(current_number, manga_list),
                        components: [previewBtn()]
                    });
                }
                //Check if cancelled
                else if (i.customId === 'cancel') {
                    button_collector.stop();
                }
                //ignore other request
                else {
                    i.deferUpdate();
                }
            });

            //stop collector
            button_collector.on('end', async () => {
                await interaction.editReply({
                    content: replyMessage + await getMangaList(current_number, manga_list),
                    components: []
                });

                await interaction.followUp('Request has been cancelled 🙂');
            })
        }
    }
}