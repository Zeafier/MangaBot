const settings = require('../model/server_settings');

module.exports = async (server_id, channel_id) => {
    //check if settings already exists
    let res = await settings.findById(server_id);
    console.log(channel_id);

    if(res) {
        //update settings
        let update = await settings.findByIdAndUpdate(server_id, {channelID: channel_id});

        if(update) {
            return true;
        }else{
            return false;
        }
    }

    //create new settings
    let new_settings = new settings({
        _id: server_id,
        channelID: channel_id
    });

    let create = await new_settings.save();

    if(create){
        return true;
    }else{
        return false;
    }
}