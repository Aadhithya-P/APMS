const express = require("express");

const {
  createFlat,
  getFlats,
  getFlatById,
  updateFlat,
  deleteFlat,
  assignResidentToFlat,
  removeResidentFromFlat,
} = require("../controllers/flatController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  createFlat
);

router.get(
  "/",
  protect,
  authorize("admin", "security"),
  getFlats
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getFlatById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFlat
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFlat
);

router.put(
  "/:flatId/assign-resident",
  protect,
  authorize("admin"),
  assignResidentToFlat
);

router.put(
  "/:flatId/remove-resident",
  protect,
  authorize("admin"),
  removeResidentFromFlat
);

module.exports = router;