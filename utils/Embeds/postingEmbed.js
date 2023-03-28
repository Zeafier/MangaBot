// at the top of your file
const { EmbedBuilder } = require('discord.js');

    
module.exports = async (title, chapter, url, cover) => {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setURL(url)
        .setDescription(`${title} has updated chapter!`)
        .setThumbnail(cover)
        .addFields({ name: chapter, value: chapter, inline: true })
}

