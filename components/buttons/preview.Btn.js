const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = () => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('<')
            .setCustomId('prev')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel('>')
            .setCustomId('next')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel('cancel')
            .setCustomId('cancel')
            .setStyle(ButtonStyle.Danger)
    )
}