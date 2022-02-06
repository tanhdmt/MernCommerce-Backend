const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log("MongoDB database connection established successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };