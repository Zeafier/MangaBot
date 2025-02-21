const { request, selected } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType, ComponentType, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require('discord.js');
const addMangaToDb = require('../../database/callbacks/addNewManga');
const previewBtn = require('../../components/buttons/preview.Btn');
const menuSelector = require('../../components/menu/mangaSelector');
const listEmbed = require('../../components/Embeds/mangaListEmbed');
const postingEmbed = require('../../components/Embeds/postEmbed');

module.exports = {
    name: 'addmanga',
    description: 'Add which manga to server\'s reading list',
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
        let text = await interaction.options.get('manga-name').value;
        const member = interaction.member;

        // Limit who can use this command - Manage guild permission requires 
        if(!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({flags: MessageFlags.Ephemeral, content: "You are not allowed to use this command. Please talk with moderator"});
        }

        // Manganato request
        let response = await request(text);
        let manga_chapters;
        let current_server = await interaction.guild.id;

        //get boolean value
        let bool = response[0], manga_info = response[1];

        if (bool === 'undefined') {
            await interaction.reply({flags: MessageFlags.Ephemeral, content: manga_info});
        } else if (manga_info.length === 1) {
            manga_chapters = await selected(manga_info[0].url);

            let db_response = await addMangaToDb(manga_chapters.title.main, manga_info[0].url, manga_chapters, current_server);

            //check if response was a boolean
            if (typeof db_response !== 'boolean') {
                await interaction.reply(db_response)
                //Check if response has been found
            } else if (db_response) {
                let embed = await postingEmbed(manga_chapters.title.main, manga_chapters.chapters[0].name, manga_chapters.chapters[0].url, manga_chapters.coverImage);
                await interaction.reply({embeds: [embed] });
            } else {
                await interaction.reply({flags: MessageFlags.Ephemeral, content: 'There was a problem with your request. Please try again or contact admin'});
            }
            
        } else {
            // number of manga in list to be displayed
            let current_number = 0;
            let selected_num;
            let max = current_number + 5 > manga_info.length ? manga_info.length : current_number + 5;
            let gotResponse = false;
            let db_reply = '';

            let replyMessage = `Found ${manga_info.length} records. Please select from the list below.`

            const message = await interaction.reply({
                flags: MessageFlags.Ephemeral,
                embeds: [await listEmbed('Searching results:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, manga_info)],
                components: [menuSelector(current_number, manga_info), previewBtn()]
            });

            //get user response
            let button_filet = msg => msg.user.id === interaction.user.id;

            let button_collector = message.createMessageComponentCollector({ button_filet, componentType: ComponentType.Button, time: 60000 });
            let collect_response  = message.createMessageComponentCollector({ button_filet, componentType: ComponentType.StringSelect, time: 70000 });

            //Get collector for the buttons
            button_collector.on('collect', async i => {
                // check if user want's next list
                if (i.customId === 'next' && current_number + 5 < manga_info.length) {
                    current_number += 5;
                    max = current_number + 5 > manga_info.length ? manga_info.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        flags: MessageFlags.Ephemeral,
                        embeds: [await listEmbed('Searching results:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, manga_info)],
                        components: [menuSelector(current_number, manga_info), previewBtn()]
                    });
                }
                // previous list
                else if (i.customId === 'prev' && current_number - 5 >= 0) {
                    current_number -= 5;
                    max = current_number + 5 > manga_info.length ? manga_info.length : current_number + 5;

                    i.deferUpdate();

                    await interaction.editReply({
                        flags: MessageFlags.Ephemeral,
                        embeds: [await listEmbed('Searching results:', `${replyMessage}. Pages ${current_number + 1} - ${max} \n\n`, current_number, max, manga_info)],
                        components: [menuSelector(current_number, manga_info), previewBtn()]
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

            //Select menu collector interaction
            collect_response.on('collect', async collected => {
                selected_num = parseInt(collected.values[0]);

                //Check if selected number is in manga
                if (selected_num >= 0 && selected_num < manga_info.length) {
                    manga_chapters = await selected(manga_info[selected_num].url);

                    let db_response = await addMangaToDb(manga_chapters.title.main, manga_info[selected_num].url, manga_chapters, current_server);

                    if (typeof db_response !== 'boolean') {
                        db_reply = db_response;
                        button_collector.stop();
                    collect_response.stop();
                    } else if (db_response) {
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

            // stop collectors
            button_collector.on('end', async collection => {
                button_collector.stop();
                collect_response.stop();
                await interaction.deleteReply();

                //check if got response
                if (gotResponse) {
                    await interaction.followUp({ embeds: [await postingEmbed(manga_chapters.title.main, manga_chapters.chapters[0].name, manga_chapters.chapters[0].url, manga_chapters.coverImage, "has been added to your list!") ]});
                } else {
                    //check if there was db reply
                    if (db_reply === '') {
                        await interaction.followUp({flags: MessageFlags.Ephemeral, content: 'Request has been cancelled 🙂'})
                    } else {
                        await interaction.followUp({ flags: MessageFlags.Ephemeral, content: db_reply });
                    }
                }
            })
        }
    }
}