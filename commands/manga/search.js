const { request, selected } = require('../../api/manganato_requests');
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'search-manga',
    description: 'Search for manga to be added',
    options: [
        {
            name: 'manga-name',
            description: 'Please provide manga name',
            type: ApplicationCommandOptionType.String,
        }
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        let text = await interaction.options.get('manga-name').value;;

        // Manganato request
        let response = await request(text);

        //check if response is a string
        if (typeof response[1] === 'string') {
            await interaction.editReply(response[1]);
        } else {
            let i = 0;
            let limit = 5;
            let max = response[1].length;
            let text = `There were too many manga on the list (found ${max} records): \n`;
            

            //get list - check if limit is bigger than max
            if (limit > max) {
                for (i; i < max; i++){
                    let current = i + 1;
                    let mangas = response[1]
                    text += `${current}. ${mangas[i].title}; link: <${mangas[i].url}>; \n`
                }
            } else {
                for (i; i < limit; i++){
                    let current = i + 1;
                    let mangas = response[1]
                    text += `${current}. ${mangas[i].title}; link: <${mangas[i].url}>; \n`
                }
            }
            
            console.log(text)

            await interaction.editReply(text)
        }
    }
}