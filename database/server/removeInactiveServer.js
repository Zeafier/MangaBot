const Manga = require('../model/add-manga');
const Server = require('../model/server_settings');

module.exports = async (server_id) => {
    try {
        
        let removeMangaRes = await Manga.deleteMany({server: server_id});
        let removeServer = await Server.findByIdAndRemove(server_id);

        //Inform that no manga was removed
        if(!removeMangaRes) {
            console.log('No manga reading registered for this server');
        }

        //Return false as there was no server
        if(!removeServer){
            return false;
        }

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}