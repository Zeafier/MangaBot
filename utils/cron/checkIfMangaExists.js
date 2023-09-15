let Manga = require('../../database/model/add-manga');
let { selected } = require('../../api/manganato_requests');
let postRemoval = require('./postRemoval');

module.exports = async (client, servers) => {
    let server_list = await Manga.find();
    let server_lists = [];

    //Check all current manga lists from server
    for (let i = 0; i < server_list.length; i++){
        let manga = server_list[i];

        try {
            let manga_info = await selected(manga.url);

            //add manga to the list if exists
            if(typeof manga_info !== 'undefined'){
                server_lists.push(manga);
            }

        } catch (error) {
            //remove manga from list if it does not exists
            await Manga.findByIdAndRemove(manga._id);
            let currentdate = new Date();
            let datetime = `${currentdate.getDate()}/${(currentdate.getMonth()+1)}/${currentdate.getFullYear()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
            console.log(`${datetime} Manga "${manga.title}" has been removed. Please check URL.`);
            
            await postRemoval(client, servers, manga.server, manga.title, manga.url);

            continue;
        }
    }

    return server_lists;
}