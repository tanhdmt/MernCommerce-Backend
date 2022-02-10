export {};
const express = require("express");
const cache = require("express-redis-cache")({
    host: process.env.REDIS_HOST || "ec2-3-89-15-171.compute-1.amazonaws.com",
    port: process.env.REDIS_PORT || 29540,
    auth_pass:
        process.env.REDIS_PASSWORD ||
        "pcaa8c827f7e852939a1fa02bdd88c3f644275443f56257250ac462a716630eec",
});
// const cache = require("express-redis-cache")();
const router = express.Router();
const pageController = require("../controllers/PageController");

router.post("/add", pageController.add);
router.put("/:id", pageController.update);
router.patch("/restore", pageController.restore);
router.patch("/:id", pageController.active);
router.delete("/force", pageController.forceDestroy);
router.delete("/", pageController.destroy);
router.get("/trash", pageController.trash);
router.get(
    "/:id/edit",
    cache.route("getPageById", 86400),
    pageController.showById
);
router.get(
    "/:slug",
    cache.route("getPageBySlug", 86400),
    pageController.showBySlug
);
router.get("/", cache.route("getAllPage", 86400), pageController.show);

module.exports = router;
