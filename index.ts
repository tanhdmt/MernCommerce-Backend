const path = require("path");
const express = require("express");
//const morgan = require('morgan')
const cors = require("cors");
//const methodOverride = require('method-override');
const app = express();

const router = require("./routers");
const db = require("./config");
const redis = require("redis");
import { promisify } from "util";

// create redis client
// const client =
//     process.env.NODE_ENV == "production"
//         ? redis.createClient({ url: process.env.REDIS_URL })
//         : redis.createClient();
// client.connect();
// client.on("connect", function () {
//     console.log("Connected!");
// });
// client.on("error", function (error: string) {
//     console.error("cache", error);
// });

// Connect to db
db.connect();

app.use(cors());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

//app.use(methodOverride('_method'));
console.log("dirname: " + __dirname);
app.use(express.static(path.join(__dirname, "..", "/uploads")));

// HTTP logger
//app.use(morgan('combined'));

// Route
router(app);

app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${process.env.PORT}`);
});
