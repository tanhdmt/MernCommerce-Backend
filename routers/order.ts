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
