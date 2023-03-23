const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = () => {
    return new ActionRowBuilder({
        components: [
            new ButtonBuilder({
                customId: 'prev',
                label: '<',
                style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
                customId: 'next',
                label: '>',
                style: ButtonStyle.Secondary
            }),
            new ButtonBuilder({
                customId: 'cancel',
                label: 'cancel',
                style: ButtonStyle.Secondary
            })
        ]
    })
}