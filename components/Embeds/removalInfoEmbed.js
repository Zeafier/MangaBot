// at the top of your file
const { EmbedBuilder } = require('discord.js');

    
module.exports = async (title, url) => {

    //set embed
    let row = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Manga removed")
        .setDescription(`Manga ${title} has been removed as it might not exists. Please check the link: ${url}`)
    
    return row;
}

