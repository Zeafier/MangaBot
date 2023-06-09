const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const today = require('../../utils/getTodayDate');
require('dotenv').config();

let manga = new Schema({
    date: {
        type: String,
        default: today
    },
    title: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    server: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
        default: 'manganato'
    },
}, {timestamps: true});

const model = mongoose.model('manga', manga);

module.exports = model;