const postingEmbed = require("../../components/Embeds/removalInfoEmbed");

module.exports = async (client, servers, server_list, title, url) => {
    //update if it is different
    let server = servers.find(e => e._id === server_list);

    let serverDet = client.guilds.cache.get(server._id).channels.cache.get(server.channelID);

    let embed = await postingEmbed(title, url);

    serverDet.send({ embeds: [embed] });
}