const removeManga = require('../../database/callbacks/removeMangaFromList');
const previewBtn = require('../../components/buttons/preview.Btn');
const menuSelector = require('../../components/menu/mangaSelector');
const listEmbed = require('../../components/Embeds/listEmbed');
const getReadingLit = require('../../database/callbacks/getReadinList');
const { ApplicationCommandOptionType, ComponentType, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const postingEmbed = require('../../components/Embeds/newMangaEmbed');

module.exports = {
    name: 'removemanga',
    description: 'Remove manga from your reading list',
    permissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: 'manga-name',
            description: 'Please provide manga name',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],

    callback: async (client, interaction) => {
        await interaction.reply({ content: `Searching...`, ephemeral: true });

        let text = await interaction.options.get('manga-name').value;
        let current_server = interaction.guild.id;

        //request manga list from server
        let server_list = await getReadingLit(current_server);
        let found_manga_list = server_list.filter(e => e.title.toLowerCase().includes(text.toLowerCase()));

        if (found_manga_list.length <= 0) { 
            //return manga not found
            await interaction.editReply({ content: `There is no manga with that title on your list. Please try to view your reading list using /list-manga`, ephemeral: true });
        } else if (found_manga_list === "NaN") { 
            // show error message
            await interaction.editReply({ content: `There is currently no reading list for this server`, ephemeral: true });
        } else if (found_manga_list.length >= 1) {
            // number of manga in list to be displayed
            let current_number = 0;
            let selected_num;
            let max = current_number + 5 > found_manga_list.length ? found_manga_list.length : current_number + 5;
            let gotResponse = false;
            let db_reply = '';

            let replyMessage = `Please select from the list below.`

            let message = await interaction.editReply({
                ephemeral: true,
                embeds: [await listEmbed('Select to remove:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, found_manga_list)],
                components: [menuSelector(current_number, found_manga_list), previewBtn()]
            });

            //get user response
            let button_filet = msg => msg.user.id === interaction.user.id;

            let button_collector = message.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 60000 });
            let collect_response  = message.createMessageComponentCollector({ button_filet, componentType: ComponentType.StringSelect, time: 70000 });

            //Get collector for the buttons
            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < found_manga_list.length) {
                    current_number += 5;
                    max = current_number + 5 > found_manga_list.length ? found_manga_list.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        ephemeral: true,
                        embeds: [await listEmbed('Select to remove:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, found_manga_list)],
                        components: [menuSelector(current_number, found_manga_list), previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;
                    max = current_number + 5 > found_manga_list.length ? found_manga_list.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        ephemeral: true,
                        embeds: [await listEmbed('Select to remove:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, found_manga_list)],
                        components: [menuSelector(current_number, found_manga_list), previewBtn()]
                    });
                }
                //Check if cancelled
                else if (i.customId === 'cancel') {
                    button_collector.stop();
                    collect_response.stop();
                }
                //ignore other request
                else {
                    i.deferUpdate();
                }
            });

            collect_response.on('collect', async collected => {
                selected_num = parseInt(collected.values[0]);
                //check if selected number is in array
                if (selected_num >= 0 && selected_num < found_manga_list.length) {
                    let removed = await removeManga(found_manga_list[selected_num]._id)

                    if (typeof removed !== 'boolean') {
                        db_reply = removed;
                        button_collector.stop();
                        collect_response.stop();
                    } else if (removed) {
                        gotResponse = true;
                        button_collector.stop();
                        collect_response.stop();
                    } else {
                        button_collector.stop();
                        collect_response.stop();
                    }
                } else {
                    button_collector.stop();
                    collect_response.stop();
                }
            });

            //End collector
            button_collector.on('end', async collections => {
                button_collector.stop();
                collect_response.stop();
                await interaction.deleteReply();

                //check if got response
                if (gotResponse) {
                    await interaction.followUp({ embeds: [await postingEmbed(found_manga_list[selected_num].title, found_manga_list[selected_num].chapter, found_manga_list[selected_num].url, 'https://cdn-icons-png.flaticon.com/512/3221/3221803.png', "has been removed from your list")] });
                } else {
                    //check if there was db reply
                    if (db_reply === '') {
                        await interaction.followUp({ ephemeral: true, content: 'Request has been cancelled 🙂' })
                    } else {
                        await interaction.followUp({ ephemeral: true, content: db_reply });
                    }
                }
            });
        }
    }
}