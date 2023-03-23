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
        //TO be improvced
        //return manga
        const meta = await manganato.getMangaMeta(mangas[0].url);
        manga_info = ['found', meta];
        return manga_info;
    }
}

let selected = async (link) => {
    const meta = await manganato.getMangaMeta(link);
    let manga_info = meta.chapters[0];
    return manga_info;
}

module.exports = {
    request,
    selected
}