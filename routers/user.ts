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

const userController = require("../controllers/UserController");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/userRole", userController.getRole);
router.put("/:id", userController.update);
router.patch("/restore", userController.restore);
router.delete("/force", userController.forceDestroy);
router.delete("/", userController.destroy);
router.get("/trash", userController.trash);
router.get("/:id/edit", cache.route("getUserById", 86400), userController.edit);
router.get("/", cache.route("getAllUser", 86400), userController.show);
// router.post('/handle-form-actions', userController.handleFormAction);
// router.get('/:slug', userController.showBySlug);

module.exports = router;
