// at the top of your file
const { EmbedBuilder } = require('discord.js');

    
module.exports = async (title, replyMessage, current, max, manga_list) => {

    let list = [];
    //get manga to be added to list
    for (let i = current; i < max; i++) {
        const manga = manga_list[i];

        list.push({
            name: `${i+1}. ${manga.title}`,
            value: `URL: ${manga.url}`,
            inline: false
        })
    }

    //set embed
    let row = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setDescription(replyMessage)
        .addFields(list);
    
    return row;
}

