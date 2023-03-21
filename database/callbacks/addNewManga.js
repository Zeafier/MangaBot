const Manga = require('../model/add-manga');
const checker = require('./checkIfExists');

module.exports = async (title, manga_info) => {
    const {name, url} = manga_info;

    try {
        let exists = await checker(title);

        //return false if manga already exists
        if(typeof exists !== 'boolean') return exists;
        if(exists) return `${title} is already on your reading list`;

        const new_manga = new Manga({
            title: title,
            chapter: name,
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