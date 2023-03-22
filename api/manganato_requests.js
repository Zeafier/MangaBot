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

        let text = `List of found mangas: \n`;
        let manga_info;
        //check for all mangas and add to list

        //check how many manga has been returned
        if (mangas.length <= 5) {

            for(let i=0; i < mangas.length; i++){
                let current = i+1;
                text += `${current}. ${mangas[i].title}; link: <${mangas[i].url}>; \n`
            }

            manga_info = ['few', text];
        }
        
        //if manga info is bigger than 5 records
        if (mangas.length > 5) {
            manga_info = ['several', mangas];
        }

        return manga_info;
    } else {

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