export {};
const express = require("express");
const client = {
    url: process.env.REDIS_URL,
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
    function (req: any, res: any, next: any) {
        // set cache name
        res.express_redis_cache_name = "getPageById-" + req.params.id;
        next();
    },
    cache.route(86400),
    pageController.showById
);
router.get(
    "/:slug",
    function (req: any, res: any, next: any) {
        // set cache name
        res.express_redis_cache_name = "getPageBySlug-" + req.params.slug;
        next();
    },
    cache.route(86400),
    pageController.showBySlug
);
router.get("/", cache.route("getAllPage", 86400), pageController.show);

module.exports = router;
