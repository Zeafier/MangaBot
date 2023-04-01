const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const today = require('../../utils/getTodayDate');
require('dotenv').config();
let year = 1000*60*60*24*365;

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
    expiresAt: {
        type: Date,
        expires: year,
        default: Date.now
    }
}, {timestamps: true});

const model = mongoose.model('manga', manga);

module.exports = model;