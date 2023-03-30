const Manga = require('../model/add-manga');

module.exports = async (id) => {
    try {
        let removed = await Manga.findByIdAndDelete(id);

        if(removed) return true

        return false;

    } catch (error) {
        console.log(error);
        return 'There was error in request';
    }
}