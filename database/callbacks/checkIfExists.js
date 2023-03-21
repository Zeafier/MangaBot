const Manga = require('../model/add-manga');

module.exports = async (title) => {
    try {
        let exists = await Manga.findOne({title: title.toLowerCase()});

        if(exists) return true

        return false;

    } catch (error) {
        console.log(error);
        return 'There was error in request';
    }
}