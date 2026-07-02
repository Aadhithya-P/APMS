const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  getMaintenanceUsers,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working"
  });
});

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/maintenance-users",
  protect,
  authorize("admin"),
  getMaintenanceUsers
);

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.put(
  "/users/:id",
  protect,
  authorize("admin"),
  updateUser
);

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);

module.exports = router;