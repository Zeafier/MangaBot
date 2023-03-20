const { get_manga } = require('../api/mangadex_request');
const { request, selected } = require('../api/manganato_requests');

// bot commands
let bot = (client, manganato) => {
    client.on('ready', () => {
        console.log(`Logged as ${client.user.tag}`)
    });

    // Read messages from discords
    client.on('messageCreate', async message => {
        if (message.author.bot) return false;

        // bot helper commands
        if (message.content.toLowerCase() === '!help') {
            message.reply(
                `Please find below bot commands. Remember, paces matter!:
                1. !set - set your bot
                2. !search <manga> - search for manga
                3. !add <manga> - add manga to your current list
                4. !remove <manga> - remove manga from your current list
                5. !list - display your reading list
                `
            )
        }

        // bot add command
        if (message.content.toLowerCase().includes('!add')) {
            message.reply('Waiting...');
            let text = message.content.toLowerCase().slice(5);

            // Manganato request
            let response = await request(text);

            //get boolean value
            let bool = response[0];
            //get array value
            let manga_info = response[1];

            if(bool) {
                return message.reply(`The following has been added to your list:
                    Name: ${text}
                    Current Chapter: ${manga_info.name}
                    Link: ${manga_info.url}
                `)
            } else {
                return message.reply(manga_info);
            }
        } 

        //add by link
        if(message.content.toLowerCase().includes('!link')) {
            message.reply('Waiting...');
            let text = message.content.toLowerCase().slice(5);

            let response = await selected(text);
            return message.reply(`The following has been added to your list:
                    Name: ${text}
                    Current Chapter: ${response.name}
                    Link: ${response.url}
                `)
        }

    })
}

module.exports = (client) => {
    return bot(client)
}