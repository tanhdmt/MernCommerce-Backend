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
const productController = require("../controllers/ProductController");

router.post("/add", productController.uploadImg, productController.add);
router.put("/:id", productController.uploadImg, productController.update);
router.patch("/decrease-qty", productController.decreaseQty);
router.patch("/restore", productController.restore);
router.patch("/:id", productController.active);
router.delete("/force", productController.forceDestroy);
router.delete("/", productController.destroy);
router.get("/trash", productController.trash);
router.get(
    "/search",
    cache.route("searchProduct", 86400),
    productController.search
);
router.get(
    "/filter",
    function (req: any, res: any, next: any) {
        // set cache name
        res.express_redis_cache_name =
            "filterProduct-" +
            req.query.cateId +
            req.query.color +
            req.query.size;
        next();
    },
    cache.route(86400),
    productController.filterProduct
);
router.get(
    "/:id/edit",
    function (req: any, res: any, next: any) {
        // set cache name
        res.express_redis_cache_name = "getProductById-" + req.params.id;
        next();
    },
    cache.route(86400),
    productController.showById
);
router.get("/", cache.route("getAllProduct", 86400), productController.show);

module.exports = router;
