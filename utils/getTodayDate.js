//get todays date
let getDate = () => {
    let today;
    let day, month, year;

    today = new Date();
    day = String(today.getDate()).padStart(2, '0');
    month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    year = today.getFullYear();

    today = day + "/" + month + "/" + year;

    return today;
}

module.exports = getDate;