module.exports = {
    name: 'help',
    description: 'Show all of the bots commands',

    callback: (client, interaction) => {
        interaction.reply(`Please find below bot commands. Remember, spaces matter!:
                1. !set - set your bot
                2. !search <manga> - search for manga
                3. !add <manga> - add manga to your current list
                4. !remove <manga> - remove manga from your current list
                5. !list - display your reading list
                `)
    }
}