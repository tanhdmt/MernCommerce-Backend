export {};
const express = require("express");
const client =
    process.env.NODE_ENV == "production" ? { url: process.env.REDIS_URL } : {};
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
const orderController = require("../controllers/OrderController");

router.post("/", orderController.add);
router.put("/:id/pay", orderController.update);
router.put("/:id/delivered", orderController.delivered);
router.patch("/restore", orderController.restore);
router.patch("/:id/status", orderController.status);
router.delete("/force", orderController.forceDestroy);
router.delete("/", orderController.destroy);
router.get("/trash", orderController.trash);
router.get(
    "/:id/mine",
    cache.route("getOrderByMine", 86400),
    orderController.showByMine
);
router.get(
    "/:id",
    cache.route("getOrderById", 86400),
    orderController.showById
);
router.get("/", cache.route("getAllOrder", 86400), orderController.show);

module.exports = router;
