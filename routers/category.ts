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
const cateController = require("../controllers/CategoryController");

router.post("/add", cateController.uploadImg, cateController.add);
router.put("/:id", cateController.uploadImg, cateController.update);
router.patch("/restore", cateController.restore);
router.patch("/:id", cateController.active);
router.delete("/:id/force", cateController.forceDestroy);
router.delete("/", cateController.destroy);
router.get("/:id/edit", cache.route("getCateById", 86400), cateController.edit);
router.get("/trash", cateController.trash);
router.get("/", cache.route("getAllCate", 86400), cateController.show);
module.exports = router;
