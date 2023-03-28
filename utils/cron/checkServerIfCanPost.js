module.exports = async (client, server_id) => {
    try {
        return typeof await client.guilds.cache.get(server_id) === 'undefined' ? false : true;
    } catch (error) {
        console.log(error)
        return false;
    }
}