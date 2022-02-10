export {};
const express = require("express");
const client =
    process.env.NODE_ENV == "production" ? { url: process.env.REDIS_URL } : {};
const cache = require("express-redis-cache")({
    options: {
        client: require("redis").createClient(client),
    },
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
    "/:id/edit",
    cache.route("getProductById", 86400),
    productController.showById
);
router.get("/", cache.route("getAllProduct", 86400), productController.show);

module.exports = router;
