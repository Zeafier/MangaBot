const { Manganato } = require('@specify_/mangascraper');
const manganato = new Manganato();

// request manga
let request = async (manga) => {
    const mangas = await manganato.search(manga);
    console.log(mangas)
    if(mangas.length > 1) {
        console.log("Please be more specific");

        let text = `List of found mangas: \n`;
        //check for all mangas and add to list
        for(let i=0; i < mangas.length; i++){
            let current = i+1;
            text += `${current}. ${mangas[i].title}; link: <${mangas[i].url}>; \n`
        }

        let manga_info = [false, text];

        return manga_info;
    } else {
        //return manga
        const meta = await manganato.getMangaMeta(mangas[0].url);
        let manga_info = [true, meta.chapters[0]];
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