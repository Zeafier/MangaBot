let { selected } = require('../../api/manganato_requests');
let Manga = require('../../database/model/add-manga');
const postChapter = require('./postChapter');
const checkServer = require('./checkServers');
const updateManga = require('./updateManga');

let poster = async (servers, client) => {
    let server_lists = await Manga.find();
    let chapter_info = [];

    //get posts for each manga
    for (let i = 0; i < server_lists.length; i++) {

        let server_list = server_lists[i];

        if(chapter_info.length <= 0){
            let manga_info = await selected(server_list.url);
            //fix that part
            let chapter = manga_info.chapters[0];

            //Push chapter to the list if there are no lists available
            chapter_info.push({
                key: server_list.url,
                chapter: chapter,
                cover: manga_info.coverImage
            });

            //check if new chapter is the same as server one
            if (chapter.name === server_list.chapter) {
                continue;
            }

            await process_update(client, servers, chapter, server_list, manga_info.coverImage);
            continue
        } else {
            //if item not in array, add new record
            const current = chapter_info.find(e => e.key === server_list.url);

            if (typeof current === 'undefined') {
                let manga_info = await selected(server_list.url);
                let chapter = manga_info.chapters[0];

                //Push chapter to the list if there are no lists available
                chapter_info.push({
                    key: server_list.url,
                    chapter: chapter,
                    cover: manga_info.coverImage
                });

                //skip if chapter is the same
                if (chapter.name === server_list.chapter) {
                    continue;
                }

                await process_update(client, servers, chapter, server_list, manga_info.coverImage);
                continue
            }

            //compare existing
            const chapter = current.chapter;
            const cover = current.cover;

            //skip if chapter is the same
            if (chapter.name === server_list.chapter) {
                continue;
            }

            await process_update(client, servers, chapter, server_list, cover);
        }
    }
}

//process to update manga
let process_update = async (client, servers, chapter, server_list, cover) => {
    //update if it is different
    let server = servers.find(e => e._id === server_list.server);
    //update in database
    await updateManga(chapter.name, server_list.chapter, server_list._id);
    //post info on server
    await postChapter(client, server_list.title, chapter.name, chapter.url, server._id, server.channelID, cover);
}

module.exports = async (client) => {
    // check if bot still has access to server
    let servers = await checkServer(client);

    //Finish cronjob if there are no servers
    if(servers.length <= 0){
        return console.log('No servers found');
    }

    try {
        await poster(servers, client);
    } catch (error) {
        console.log(error);
    }   
    
}