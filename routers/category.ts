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
