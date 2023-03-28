const postingEmbed = require("../Embeds/postingEmbed");


module.exports = async (client, title, chapterName, url, server_id, channel_id, cover) => {

    let server = client.guilds.cache.get(server_id).channels.cache.get(channel_id);

    let embed = await postingEmbed(title, chapterName, url, cover);

    server.send({ embeds: [embed] });
    
}