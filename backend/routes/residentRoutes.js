const express = require("express");

const {
  createResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
} = require("../controllers/residentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  createResident
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getResidents
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getResidentById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateResident
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteResident
);

module.exports = router;