const {devs, testServer} = require('../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        //get command name
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        )

        //check if command exists
        if (!commandObject) return;

        //check if this command is only for devs
        if (commandObject.devOnly) {
            if (!(devs.includes(interaction.member.id))) {
                interaction.reply({
                    content: 'Only developer are allowed to use this command.',
                    ephemeral: true,
                });
                return;
            }
        }


        //check if command is only for test server
        if (commandObject.testOnly) {
            if (!(interaction.guild.id===testServer)) {
                interaction.reply({
                    content: 'This command cannot be run here.',
                    ephemeral: true,
                });
                return;
            }
        }

        //check if member has enough permissions
        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permission.has(permission)) {
                    interaction.reply({
                        content: 'Not enough permissions to run this command',
                        ephemeral: true
                    });
                    break;
                }
            }
        }

        // Check if bot have enough permissions
        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                if (!interaction.member.permission.has(permission)) {
                    const bot = interaction.guild.member.me;

                    if (bot.permissions.has(permission)) {
                        interaction.reply({
                            content: "I don't have enough permissions",
                            ephemeral: true
                        })
                    }
                    break;
                }
            }
        }

        await commandObject.callback(client, interaction);

    } catch (error) {
        console.log(error)
    }
}