const postingEmbed = require("../../components/Embeds/postEmbed");


module.exports = async (client, title, chapterName, url, server_id, channel_id, cover) => {

    let server = client.guilds.cache.get(server_id).channels.cache.get(channel_id);

    let embed = await postingEmbed(title, chapterName, url, cover, "has updated chapter!");

    server.send({ embeds: [embed] });
    
}