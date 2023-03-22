const Manga = require('../model/add-manga');
const checker = require('./checkIfExists');

module.exports = async (manga_info) => {
    const title = manga_info.title.main;
    const chapter = manga_info.chapters[0].name;
    const url = manga_info.chapters[0].url;

    try {
        let exists = await checker(title);

        //return false if manga already exists
        if(typeof exists !== 'boolean') return exists;
        if(exists) return `${title} is already on your reading list`;

        const new_manga = new Manga({
            title: title,
            chapter: chapter,
            url: url
        });

        let response = await new_manga.save();

        if (response) return true
        return false
    } catch (error) {
        console.log(error);
        return false;
    }
}