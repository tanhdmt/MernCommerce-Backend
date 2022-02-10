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
const sizeController = require("../controllers/SizeController");

router.post("/add", sizeController.add);
router.put("/:id", sizeController.update);
router.patch("/restore", sizeController.restore);
router.delete("/force", sizeController.forceDestroy);
router.delete("/", sizeController.destroy);
router.get(
    "/:id/edit",
    cache.route("getSizeById", 86400),
    sizeController.showById
);
router.get("/trash", sizeController.trash);
router.get("/", cache.route("getAllSize", 86400), sizeController.show);

module.exports = router;
