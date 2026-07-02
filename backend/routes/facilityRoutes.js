const express = require("express");

const {
  createFacility,
  getFacilities,
  updateFacility,
  deleteFacility,
} = require(
  "../controllers/facilityController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  authorize,
} = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

router.get(
  "/",
  protect,
  getFacilities
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createFacility
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFacility
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFacility
);

module.exports = router;