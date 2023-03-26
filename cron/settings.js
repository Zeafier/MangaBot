let { request } = require('../api/manganato_requests');
let Manga = require('../database/model/add-manga');
const postChapter = require('./postChapter');
const checkServer = require('./checkServers');
const updateManga = require('./updateManga');

module.exports = async (client) => {
    // check if bot still has access to server
    let servers = await checkServer(client);
    let manga_lists = await Manga.find();
    let chapter_info = {};

    //Finish cronjob if there are no servers
    if(servers.length <= 0){
        return console.log('No servers found');
    }

    for (const i = 0; i < manga_lists.length; i++) {

        let manga_list = manga_lists[i];

        if(chapter_info.length <= 0){
            let manga_info = await request(manga_list.url);
            //fix that part
            let chapter = manga_info.chapter;

            //Push chapter to the list if there are no lists available
            chapter_info[manga_list.url] = chapter;

            if (chapter === manga_list.chapter) {
                continue;
            }

            await updateManga(manga_info.chapters[0].name, manga_list.chapter, manga_info._id);
        } else {
            //if item not in array, add new record
            if (!(manga_list.url in chapter_info)) {
                let manga_info = await request(manga_list.url);
                let chapter = manga_info.chapters[0].name;

                //Push chapter to the list if there are no lists available
                chapter_info[manga_list.url] = chapter;

                if (chapter === manga_list.chapter) {
                    continue;
                }

                await updateManga(manga_info.chapters[0].name, manga_list.chapter, manga_info._id);
            }

            //compare existing
            let current = chapter_info[manga_list.url];

            console.log(current);
        }
    }
}