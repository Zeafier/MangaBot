let Manga = require('../database/model/add-manga');

module.exports = async (currentChapter, serverChapter, serverChapterId) => {
    try {
        if(currentChapter !== serverChapter) {
            let update = await Manga.findByIdAndUpdate(serverChapterId, {chapter: currentChapter});
    
            if(!update) {
                console.log('There was an error in updating one of the manga');
            }
        }
    } catch (error) {
        console.log(error);
    }
    
}