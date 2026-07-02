const express = require("express");

const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  createNotice
);

router.get(
  "/",
  protect,
  getNotices
);

router.get(
  "/:id",
  protect,
  getNoticeById
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateNotice
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteNotice
);

module.exports = router;