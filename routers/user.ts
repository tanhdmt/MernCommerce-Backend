export {};
const express = require("express");
const client = {
    url: process.env.REDIS_URL,
};
const cache = require("express-redis-cache")({
    client: require("redis").createClient(client),
});
cache.on("message", function (message: string) {
    console.log("cache", message);
});

cache.on("error", function (error: string) {
    console.error("cache", error);
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
router.get(
    "/:id/edit",
    function (req: any, res: any, next: any) {
        // set cache name
        res.express_redis_cache_name = "getUserById-" + req.params.id;
        next();
    },
    cache.route(86400),
    userController.edit
);
router.get("/", cache.route("getAllUser", 86400), userController.show);
// router.post('/handle-form-actions', userController.handleFormAction);
// router.get('/:slug', userController.showBySlug);

module.exports = router;
