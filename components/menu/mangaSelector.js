const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = (current, manga_list) => {

    let options = [];
    let max;
    let string_length = 25;

    //check if list bigger than array list
    if (manga_list.length < current + 5) {
        max = manga_list.length
    } else {
        max = current + 5;
    }

    //get options
    for (let i = current; i < max; i++){
        const manga = manga_list[i];

        options.push({
            label: `${i+1}. ${manga.title.substring(0, string_length)}`,
            description: manga.url,
            value: i.toString()
        })
    }

    //create menu
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Not selected')
                .addOptions(options),
    );
    return row;
}