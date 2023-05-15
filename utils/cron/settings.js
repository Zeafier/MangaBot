const checkServer = require('./checkServers');
const process_update = require ('./processUpdate');
let { selected } = require('../../api/manganato_requests');
let Manga = require('../../database/model/add-manga');
let MangaExists = require('./checkIfMangaExists');
const year_to_mill = 1000*60*60*24*365;

module.exports = async (client) => {

    try {
        // get server list
        let servers = await checkServer(client);
        const today = new Date();
        const today_to_mill = today.getTime();

        // let server_lists = await Manga.find();

        let server_lists = await MangaExists();

        let chapter_info = [];

        //get posts for each manga
        for (let i = 0; i < server_lists.length; i++) {
            //assign server list to variable
            let server_list = server_lists[i];
            const last_updated_to_mill = server_list.updatedAt.getTime();

            //remove record if it was updated last year
            if((today_to_mill - last_updated_to_mill) > year_to_mill) {
                await Manga.findByIdAndRemove(server_list._id);
                continue;
            }

            //check if server's reading id is in servers array - if not remove
            let onList = servers.find(e => e._id === server_list.server);
            if(typeof onList === "undefined") {
                await Manga.findByIdAndRemove(server_list._id);
                continue;
            }

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
    } catch (error) {
        console.log(error);
    }   
    
}