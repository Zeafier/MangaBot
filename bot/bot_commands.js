const { get_manga } = require('../api/mangadex_request');

// bot commands
let bot = (client) => {
    client.on('ready', () => {
        console.log(`Logged as ${client.user.tag}`)
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    })

    client.on('messageCreate', async message => {
        if (message.author.bot) return false;

        // bot helper commands
        if (message.content.toLowerCase() === 'mangabot help') {
            message.reply(
                `Please find below bot commands:
                1. mangabot set - set your bot
                2. mangabot search - search for manga
                3. mangabot add <manga> - add manga to your current list
                4. mangabot remove <manga> - remove manga from your current list
                5. mangabot list - display your reading list
                `
            )
        }

        // bot add command
        if (message.content.toLowerCase().includes('mangabot add')) {
            message.reply('Waiting...');
            let text = message.content.toLowerCase().slice(13);
            let response = await get_manga(text);

            // Check if there was an error
            if (response === "error") {
                return message.reply("There was error with your request");
            }

            if (response.length > 1) {
                console.log('There were more items');
                let reply = `Please select: \n`;
                for (let i = 0; i < response.length; i++){
                    console.log(i)
                    let current_number = i + 1;
                    reply += `${current_number}. ${response[i]}; \n`
                }
                console.log(reply);
            } else {
            message.reply(`${text} has been added to your list.`);
        }
        } 
    })
}

module.exports = (client) => {
    return bot(client)
}