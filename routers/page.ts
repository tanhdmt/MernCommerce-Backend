export {};
const express = require("express");
const router = express.Router();
const pageController = require("../controllers/PageController");

router.post("/add", pageController.add);
router.put("/:id", pageController.update);
router.patch("/restore", pageController.restore);
router.patch("/:id", pageController.active);
router.delete("/force", pageController.forceDestroy);
router.delete("/", pageController.destroy);
router.get("/trash", pageController.trash);
router.get("/:id/edit", pageController.showById);
router.get("/:slug", pageController.showBySlug);
router.get("/", pageController.show);

module.exports = router;
