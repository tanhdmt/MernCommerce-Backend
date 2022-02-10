export {};
const express = require("express");
const cache = require("express-redis-cache")({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PASSWORD,
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
