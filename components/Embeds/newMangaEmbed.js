// at the top of your file
const { EmbedBuilder } = require('discord.js');

    
module.exports = async (title, chapter, url, cover, customMessage) => {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setURL(url)
        .setDescription(`${title} ${customMessage}`)
        .setThumbnail(cover)
        .addFields({ name: chapter, value: chapter, inline: true })
}

