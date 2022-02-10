export {};
const express = require("express");
const client = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD,
};
const cache = require("express-redis-cache")({
    client: require("redis").createClient(client),
});
cache.on("message", function (message: string) {
    console.log("cache", message);
});

cache.on("error", function (error: string) {
    console.error("cache", error);
});
//const cache = require("express-redis-cache")();
const router = express.Router();
const colorController = require("../controllers/ColorController");

router.post("/add", colorController.add);
router.put("/:id", colorController.update);
router.patch("/restore", colorController.restore);
router.delete("/force", colorController.forceDestroy);
router.delete("/", colorController.destroy);
router.get("/trash", colorController.trash);
router.get(
    "/:id/edit",
    cache.route("getColorById", 86400),
    colorController.showById
);
router.get("/", cache.route("getAllColor", 86400), colorController.show);

module.exports = router;
