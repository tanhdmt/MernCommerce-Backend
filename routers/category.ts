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
//const cache = require("express-redis-cache")();
const router = express.Router();
const cateController = require("../controllers/CategoryController");

router.post("/add", cateController.uploadImg, cateController.add);
router.put("/:id", cateController.uploadImg, cateController.update);
router.patch("/restore", cateController.restore);
router.patch("/:id", cateController.active);
router.delete("/:id/force", cateController.forceDestroy);
router.delete("/", cateController.destroy);
router.get(
    "/filter",
    function (req: any, res: any, next: any) {
        // set cache name
        res.express_redis_cache_name = "filterCate-" + req.query.parentCateId;
        next();
    },
    cache.route(86400),
    cateController.filter
);
router.get(
    "/:id/edit",
    function (req: any, res: any, next: any) {
        // set cache name
        res.express_redis_cache_name = "getCateById-" + req.params.id;
        next();
    },
    cache.route(86400),
    cateController.edit
);
router.get("/trash", cateController.trash);
router.get("/", cache.route("getAllCate", 86400), cateController.show);
module.exports = router;
