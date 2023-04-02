const updateManga = require('./updateManga');
const postChapter = require('./postChapter');

module.exports = async (client, servers, chapter, server_list, cover) => {
    //update if it is different
    let server = servers.find(e => e._id === server_list.server);
    //update in database
    await updateManga(chapter.name, server_list.chapter, server_list._id);
    //post info on server
    await postChapter(client, server_list.title, chapter.name, chapter.url, server._id, server.channelID, cover);
}