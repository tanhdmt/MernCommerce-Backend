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
const sizeController = require("../controllers/SizeController");

router.post("/add", sizeController.add);
router.put("/:id", sizeController.update);
router.patch("/restore", sizeController.restore);
router.delete("/force", sizeController.forceDestroy);
router.delete("/", sizeController.destroy);
router.get(
    "/:id/edit",
    cache.route("getSizeById", 86400),
    sizeController.showById
);
router.get("/trash", sizeController.trash);
router.get("/", cache.route("getAllSize", 86400), sizeController.show);

module.exports = router;
