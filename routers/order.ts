export {};
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

router.post("/", orderController.add);
router.put("/:id/pay", orderController.update);
router.put("/:id/delivered", orderController.delivered);
router.patch("/restore", orderController.restore);
router.patch("/:id/status", orderController.status);
router.delete("/force", orderController.forceDestroy);
router.delete("/", orderController.destroy);
router.get("/trash", orderController.trash);
router.get("/:id/mine", orderController.showByMine);
router.get("/:id", orderController.showById);
router.get("/", orderController.show);

module.exports = router;
