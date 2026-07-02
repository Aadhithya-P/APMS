const express =
require("express");

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  deleteBooking,
  updateBooking,
} = require(
  "../controllers/eventBookingController"
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

const router =
express.Router();

router.post(
  "/",
  protect,
  authorize("resident"),
  createBooking
);

router.get(
  "/my",
  protect,
  authorize("resident"),
  getMyBookings
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllBookings
);

router.put(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveBooking
);

router.put(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectBooking
);

router.put(
  "/:id",
  protect,
  authorize("admin", "resident"),
  updateBooking
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "resident"),
  deleteBooking
);

module.exports = router;