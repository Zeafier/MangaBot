const settings = require('../model/server_settings');

module.exports = async () => {
    //check if settings already exists
    let res = await settings.find();

    return res;
}