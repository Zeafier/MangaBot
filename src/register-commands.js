const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'help',
        description: 'Supporting user to show available commands'
    },
    {
        name: 'channel',
        description: 'Set where your bot is supposed to post manga updates',
        options: [
            {
                name: 'channel-name',
                description: 'Write channel name',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands')

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        )

        console.log('All good')
    } catch (error) {
        console.log(error);
    }
})();