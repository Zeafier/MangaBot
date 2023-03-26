const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

let server_setting = new Schema({
    _id: {
        type: String,
        required: true
    },
    channelID: {
        type: String,
        required: true
    }
}, {timestamps: true});

const model = mongoose.model('server_setting', server_setting);

module.exports = model;