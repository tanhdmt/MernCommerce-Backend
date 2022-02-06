export {};
const express = require("express");
const router = express.Router();
const sizeController = require("../controllers/SizeController");

router.post("/add", sizeController.add);
router.put("/:id", sizeController.update);
router.patch("/restore", sizeController.restore);
router.delete("/force", sizeController.forceDestroy);
router.delete("/", sizeController.destroy);
router.get("/:id/edit", sizeController.showById);
router.get("/trash", sizeController.trash);
router.get("/", sizeController.show);

module.exports = router;
