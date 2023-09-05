//variables
require('dotenv').config();
const mongoose = require('mongoose');
const url = process.env.TestingDB;


const connectDB = async () => {
    if(!url) return;

    try {
        await mongoose.connect(url, {
            useNewURLParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to db!");
    } catch (error) {
        console.log("Failed to connect", error);
    }
}

module.exports = connectDB();