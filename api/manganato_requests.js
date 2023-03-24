const { Manganato } = require('@specify_/mangascraper');
const manganato = new Manganato();

// request manga
let request = async (manga) => {
    const mangas = await manganato.search(manga);

    //Check if manga exists
    if(mangas.length < 1) {
        return ['undefined', 'No manga with this title has been found']
    }

    if(mangas.length > 1) {
        let manga_info = ['several', mangas];
        return manga_info;

    } else {
        manga_info = ['found', mangas[0]];
        return manga_info;
    }
}

// get manga information about selected
let selected = async (link) => {
    const meta = await manganato.getMangaMeta(link);

    return meta;
}

module.exports = {
    request,
    selected
}