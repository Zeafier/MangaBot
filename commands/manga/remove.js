const { request, selected } = require('../../api/manganato_requests');

module.exports = {
    name: 'remove-manga',
    description: 'Remove manga from your reading list',
    // options: Object[]
    // deleted: Boolean

    callback: (client, interaction) => {
        const channel = interaction.options.get('channel-name').value;
        interaction.reply(channel)
    }
}