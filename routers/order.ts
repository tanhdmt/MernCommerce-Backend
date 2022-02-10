export {};
const express = require("express");
const cache = require("express-redis-cache")({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PASSWORD,
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
