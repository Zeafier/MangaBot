
const { ComponentType } = require('discord.js');
const listEmbed = require('../../components/Embeds/listEmbed');
const getReadingList = require('../../database/callbacks/getReadinList');
const previewBtn = require('../../components/buttons/preview.Btn');

//will be used for reading list
module.exports = {
    name: 'showmangalist',
    description: 'Display your current manga reading list',

    callback: async (client, interaction) => {
        await interaction.reply('Waiting...');

        let current_number = 0;
        let max;
        let server_id = await interaction.guild.id;

        // Manganato request
        let res = await getReadingList(server_id);

        max = current_number + 5 > res.length ? res.length : current_number + 5;

        let replyMessage = `There are currently ${res.length} on your reading list.`

        let message = await interaction.editReply({
            ephemeral: true,
            embeds: [await listEmbed('Your reading list:', `${replyMessage} Pages: ${current_number + 1} - ${max}`, current_number, max, res)],
            components: [previewBtn()]
        });

        let button_filet = msg => msg.user.id === interaction.user.id;
        let button_collector = message.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 60000 });

        if (res === 'NaN') {
            await interaction.editReply({ content: 'There is no manga on your reading list', components: [] });
        } else {
            //Get collector for the buttons
            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < res.length) {
                    current_number += 5;
                    max = current_number + 5 > res.length ? res.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        embeds: [await listEmbed('Your reading list:', replyMessage + `Page ${current_number + 1} - ${max} \n\n`, current_number, max, res)],
                        components: [previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;
                    max = current_number + 5 > res.length ? res.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        embeds: [await listEmbed('Your reading list:', replyMessage + `Page ${current_number + 1} - ${max} \n\n`, current_number, max, res)],
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
                
                button_collector.stop();
                await interaction.deleteReply();
                await interaction.followUp('Viewing request has been cancelled 🙂');
            })
        }
    }
}