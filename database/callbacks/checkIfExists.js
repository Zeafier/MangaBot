const Manga = require('../model/add-manga');

module.exports = async (title, server_id) => {
    try {
        let exists = await Manga.findOne({title: title, server: server_id});

        if(exists) return true

        return false;

    } catch (error) {
        console.log(error);
        return 'There was error in request';
    }
}