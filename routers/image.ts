export {};
const express = require("express");
const cache = require("express-redis-cache")({
    host: process.env.REDIS_HOST || "ec2-3-89-15-171.compute-1.amazonaws.com",
    port: process.env.REDIS_PORT || 29540,
    auth_pass:
        process.env.REDIS_PASSWORD ||
        "pcaa8c827f7e852939a1fa02bdd88c3f644275443f56257250ac462a716630eec",
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
