const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("resident"),
  createComplaint
);

router.get(
  "/my",
  protect,
  authorize("resident"),
  getMyComplaints
);

router.get(
  "/",
  protect,
  authorize("admin", "maintenance"),
  getAllComplaints
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getComplaintById
);

router.put(
  "/:id/assign",
  protect,
  authorize("admin"),
  assignComplaint
);

router.put(
  "/:id/status",
  protect,
  authorize("maintenance"),
  updateComplaintStatus
);

module.exports = router;