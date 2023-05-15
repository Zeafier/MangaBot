const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const Manga = require('../../database/model/add-manga');

module.exports = {
    name: 'delete-all',
    description: 'Delete manga',
    permissions: PermissionFlagsBits.ManageGuild,
    devOnly: true,
    testOnly: false,
    deleted: false,

    callback: async (client, interaction) => {
        let removed = await Manga.deleteMany({});

        if(removed){
            interaction.reply('Records removed')
        }
        
    }
}