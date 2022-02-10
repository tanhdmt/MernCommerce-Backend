export {};
const express = require("express");
const cache = require("express-redis-cache")({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PASSWORD,
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
