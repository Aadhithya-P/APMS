const express = require("express");

const {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  checkInVisitor,
  checkOutVisitor,
  approveRejectVisitor,
  deleteVisitor,
} = require("../controllers/visitorController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("security"),
  createVisitor
);

router.get(
  "/my",
  protect,
  authorize("resident"),
  getMyVisitors
);

router.put(
  "/:id/respond",
  protect,
  authorize("resident"),
  approveRejectVisitor
);

router.get(
  "/",
  protect,
  authorize("admin", "security"),
  getAllVisitors
);

router.put(
  "/:id/checkin",
  protect,
  authorize("security"),
  checkInVisitor
);

router.put(
  "/:id/checkout",
  protect,
  authorize("security"),
  checkOutVisitor
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteVisitor
);

module.exports = router;