module.exports = (current, manga_list) => {
    let text = ``;

    //get max list size to be displayed
    let max;
    if (current + 5 >= manga_list.length) {
        max = manga_list.length
    } else {
        max = current + 5;
    }

    // get 5 records
    for (let i = current; i < max; i++) {
        let manga = manga_list[i];
        let number = i + 1;

        text += `${number}. ${manga.title}; link: <${manga.url}>; \n`
    }

    return text;
}