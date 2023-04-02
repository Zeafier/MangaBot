module.exports = {
    name: 'help',
    description: 'Display all of the bots commands',

    callback: async (client, interaction) => {
        await interaction.reply(`Please find below valid bot commands. Please note that there is timer of 60s for each of them:
        1. /addmanga <manga name> - add manga to your reading list (permission required)
        2. /searchmanga <manga name> - search for manga
        3. /showmangalist - get server's current reading list
        4. /removemanga <manga name> - remove manga from server's reading list (permissions required)
        5. /channel <select> - select where bot should post chapters (permissions required)`)
    }
}