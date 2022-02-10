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
