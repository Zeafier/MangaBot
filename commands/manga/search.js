const { request } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType, ComponentType, MessageFlags } = require('discord.js');
const listEmbed = require('../../components/Embeds/mangaListEmbed');
const previewBtn = require('../../components/buttons/preview.Btn');

module.exports = {
    name: 'searchmanga',
    description: 'Search for manga to be added',
    options: [
        {
            name: 'manga-name',
            description: 'Search for manga',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    callback: async (client, interaction) => {
        await interaction.reply({flags: MessageFlags.Ephemeral, content: 'Please wait...'});
        let text = await interaction.options.get('manga-name').value;

        // Manganato request
        let res = await request(text);
        let type = res[0], manga_list = res[1];

        //Check if there are results
        if (type === "undefined") {
            await interaction.editReply({ flags: MessageFlags.Ephemeral, content: manga_list, components: [] });
        } else {
            let current_number = 0;
            let max = current_number + 5 > manga_list.length ? manga_list.length : current_number + 5;

            let replyMessage = `Found ${manga_list.length} manga with this title.`

            //await response
            let message = await interaction.editReply({
                flags: MessageFlags.Ephemeral,
                embeds: [await listEmbed('Searching results:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, manga_list)],
                components: [previewBtn()]
            });

            let button_filet = msg => msg.user.id === interaction.user.id;
            let button_collector = message.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 60000 });

            //Get collector for the buttons
            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < manga_list.length) {
                    current_number += 5;
                    max = current_number + 5 > manga_list.length ? manga_list.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        flags: MessageFlags.Ephemeral,
                        embeds: [await listEmbed('Searching results:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, manga_list)],
                        components: [previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;
                    max = current_number + 5 > manga_list.length ? manga_list.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        flags: MessageFlags.Ephemeral,
                        embeds: [await listEmbed('Searching results:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, manga_list)],
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
                await button_collector.stop();
                await interaction.deleteReply();
                await interaction.followUp({flags: MessageFlags.Ephemeral, content: 'Request has been cancelled 🙂'});
            })
        }
    }
}