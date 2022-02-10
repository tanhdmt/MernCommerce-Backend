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
const imageController = require("../controllers/ImageController");

router.post("/add", imageController.uploadImg, imageController.add);
router.put("/:id", imageController.uploadImg, imageController.update);
router.patch("/restore", imageController.restore);
router.patch("/:id", imageController.active);
router.delete("/force", imageController.forceDestroy);
router.delete("/", imageController.destroy);
router.get("/trash", imageController.trash);
router.get(
    "/:id/edit",
    cache.route("getCateById", 86400),
    imageController.showById
);
router.get("/:slug", imageController.showBySlug);
router.get("/", imageController.show);

module.exports = router;
