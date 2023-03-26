module.exports = {
    name: 'help',
    description: 'Display all of the bots commands',

    callback: (client, interaction) => {
        interaction.reply(`Please find below valid bot commands. Please note that there is timer of 60s for each of them:
        1. /add-manga <manga name> - add manga to your reading list (permission required)
        2. /search-manga <manga name> - search for manga
        3. /list-manga - get server's current reading list
        4. /remove-manga <manga name> - remove manga from server's reading list (permissions required)
        5. /channel <select> - select where bot should post chapters (permissions required)`)
    }
}