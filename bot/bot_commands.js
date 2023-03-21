const { request, selected } = require('../api/manganato_requests');

// bot commands
let bot = (client) => {

    // Read messages from discords
    client.on('messageCreate', async message => {
        if (message.author.bot) return false;

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