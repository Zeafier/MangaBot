const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const checker = require('../../utils/cron/checkServerIfCanPost');
const settings = require('../../utils/cron/settings');

module.exports = {
    name: 'test-server',
    description: 'Check if bot can post on server',
    permissions: PermissionFlagsBits.ManageGuild,
    devOnly: true,
    testOnly: false,
    // options: [
    //     {
    //         name: 'server-id',
    //         description: 'type server id',
    //         required: true,
    //         type: ApplicationCommandOptionType.String
    //     }
    // ],
    deleted: false,

    callback: async (client, interaction) => {
        // const serv = interaction.options.get('server-id').value;
        
        // let result = await checker(client, serv);

        // if(result) {
        //     interaction.reply(`I can post on ${serv} id`)
        // } else {
        //     interaction.reply('I dont have access to this server')
        // }

        //test cron script
        settings(client);
        interaction.reply('Check logs')
    }
}