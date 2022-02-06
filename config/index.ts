const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {
    try {
        const uri = process.env.MONGO_URI;
        mongoose.connect(
            uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            () => console.log("MongoDB Connected")
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };
