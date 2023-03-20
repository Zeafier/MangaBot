const axios = require('axios');
const baseUrl = 'https://api.mangadex.org';

//get manga updates
let get_manga = async (mangatitle) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/manga`,
            params: {
                title: mangatitle
            }
        });
        let manga_id = res.data.data.map(manga => manga.id)

        return manga_id
    } catch (error) {
        console.log(error);
        return "error"
    }
    
}

module.exports = {
    get_manga
}