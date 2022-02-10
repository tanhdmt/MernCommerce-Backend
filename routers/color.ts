export {};
const express = require("express");
const client = process.env.NODE_ENV?.includes("production")
    ? { url: process.env.REDIS_URL }
    : {};
const cache = require("express-redis-cache")({
    options: {
        client: require("redis").createClient(client),
    },
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
