export {};
const express = require("express");
const cache = require("express-redis-cache")({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PASSWORD,
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
