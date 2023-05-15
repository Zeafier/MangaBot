let Manga = require('../../database/model/add-manga');
let { selected } = require('../../api/manganato_requests');

module.exports = async () => {
    let server_list = await Manga.find();
    let passed_list = [];

    //Check all current manga lists from server
    for (let i = 0; i < server_list.length; i++){
        let manga = server_list[i];

        try {
            let manga_info = await selected(manga.url);

            //add manga to the list if exists
            if(typeof manga_info !== 'undefined'){
                passed_list.push(manga);
            }

        } catch (error) {
            //remove manga from list if it does not exists
            await Manga.findByIdAndRemove(manga._id);
            console.log(`Manga ${manga.title} does not exists anymore and has been removed`);
            continue;
        }
    }

    return passed_list;
}