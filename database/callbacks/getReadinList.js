const Manga = require('../model/add-manga');

module.exports = async (server_id) => {
    let records = await Manga.find({ server: server_id });
    
    if (records.length > 0) {
        return records;
    }

    return "NaN"
}