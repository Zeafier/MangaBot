
const { ComponentType } = require('discord.js');
const getMangaList = require('../../utils/getMangaList');
const getReadingList = require('../../database/callbacks/getReadinList');
const previewBtn = require('../../buttons/preview.Btn');

//will be used for reading list
module.exports = {
    name: 'list-manga',
    description: 'Display your current manga reading list',

    callback: async (client, interaction) => {
        await interaction.reply('Waiting...');

        let current_number = 0;
        let max;
        let server_id = interaction.guild.id;

        // Manganato request
        let res = await getReadingList(server_id);

        if (current_number + 5 > res.length) {
            max = res.length;
        } else {
            max = current_number + 5;
        }

        let replyMessage = `There are currently ${res.length} on your reading list. Page ${current_number + 1} - ${max} \n\n`

        await interaction.editReply({
            ephemeral: true,
            content: replyMessage + await getMangaList(current_number, res),
            components: [previewBtn()]
        });

        let button_filet = msg => msg.user.id === interaction.user.id;
        let button_collector = interaction.channel.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 60000 });

        if (res === 'NaN') {
            await interaction.editReply({ content: 'There is no manga on your reading list', components: [] });
        } else {
            //Get collector for the buttons
            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < res.length) {
                    current_number += 5;

                    i.deferUpdate();

                    interaction.editReply({
                        content: replyMessage + await getMangaList(current_number, res),
                        components: [previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;

                    i.deferUpdate();

                    interaction.editReply({
                        content: replyMessage + await getMangaList(current_number, res),
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
                    content: replyMessage + await getMangaList(current_number, res),
                    components: []
                });

                await interaction.followUp('Viewing request has been cancelled 🙂');
            })
        }
    }
}