module.exports = {
    name: 'ping',
    description: 'pingpong',
    devOnly: true,
    testOnly: true,
    // options: Object[]
    deleted: true,

    callback: (client, interaction) => {
        interaction.reply('Pong!')
    }
}