export {};
const express = require("express");
const router = express.Router();
const cateController = require("../controllers/CategoryController");

router.post("/add", cateController.uploadImg, cateController.add);
router.put("/:id", cateController.uploadImg, cateController.update);
router.patch("/restore", cateController.restore);
router.patch("/:id", cateController.active);
router.delete("/:id/force", cateController.forceDestroy);
router.delete("/", cateController.destroy);
router.get("/:id/edit", cateController.edit);
router.get("/trash", cateController.trash);
router.get("/", cateController.show);
module.exports = router;
