// at the top of your file
const { EmbedBuilder } = require('discord.js');

    
module.exports = async (title, replyMessage, list) => {

    //set embed
    let row = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setDescription(replyMessage)
        .addFields(list);
    
    return row;
}

