const removeManga = require('../../database/callbacks/removeMangaFromList');
const isNumber = require('../../utils/isNumber');
const previewBtn = require('../../buttons/preview.Btn');
const getReadingLit = require('../../database/callbacks/getReadinList');
const { ApplicationCommandOptionType, ComponentType, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const getMangaList = require('../../utils/getMangaList');

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
            let gotResponse = false;
            let db_reply = '';

            let replyMessage = `Please select number to confirm which manga you want to remove \n \n`

            await interaction.editReply({
                ephemeral: true,
                content: replyMessage + await getMangaList(current_number, found_manga_list),
                components: [previewBtn()]
            });

            //get user response
            let filter = msg => msg.author.id === interaction.user.id;
            let button_filet = msg => msg.user.id === interaction.user.id;

            let collector = await interaction.channel.createMessageCollector({
                filter,
                time: 60000
            });
            let button_collector = await interaction.channel.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 70000 });

            //Get collector for the buttons
            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < found_manga_list.length) {
                    current_number += 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        ephemeral: true,
                        content: replyMessage + await getMangaList(current_number, found_manga_list),
                        components: [previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        ephemeral: true,
                        content: replyMessage + await getMangaList(current_number, found_manga_list),
                        components: [previewBtn()]
                    });
                }
                //Check if cancelled
                else if (i.customId === 'cancel') {
                    button_collector.stop();
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
                    selected_num = parseInt(reply) - 1;

                    //check if selected number is in array
                    if (selected_num >= 0 && selected_num < found_manga_list.length) {
                        let removed = await removeManga(found_manga_list[selected_num]._id)

                        if (typeof removed !== 'boolean') {
                            db_reply = removed;
                            button_collector.stop();
                            collector.stop();
                        } else if (removed) {
                            gotResponse = true;
                            button_collector.stop();
                            collector.stop();
                        } else {
                            button_collector.stop();
                            collector.stop();
                        }
                    } else {
                        button_collector.stop();
                        collector.stop();
                    }
                }
                else {
                    button_collector.stop();
                    collector.stop();
                }
            }

            //check if got response
            if (gotResponse) {
                await interaction.deleteReply();
                await interaction.followUp({
                    content: `The following has been removed from your list:
                Name: ${found_manga_list[selected_num].title}
                Link: <${found_manga_list[selected_num].url}>`, components: []
                });
            } else {
                await interaction.deleteReply();

                //check if there was db reply
                if (db_reply === '') {
                    await interaction.followUp({ephemeral: true, content: 'Request has been cancelled 🙂'})
                } else {
                    await interaction.followUp({ ephemeral: true, content: db_reply });
                }
            }
        }
    }
}