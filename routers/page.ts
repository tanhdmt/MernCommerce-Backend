export {};
const express = require("express");
// const cache = require("express-redis-cache")({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     auth_pass: process.env.REDIS_PASSWORD,
// });
const cache = require("express-redis-cache")();
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
