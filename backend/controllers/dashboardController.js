const Resident = require("../models/Resident");
const Flat = require("../models/Flat");
const Complaint = require("../models/Complaint");
const Visitor = require("../models/Visitor");
const Notice = require("../models/Notice");
const EventBooking = require("../models/EventBooking");

const getDashboardStats = async (req, res) => {
  if (req.user.role === "resident") {

    const resident =
      await Resident.findOne({
        user: req.user._id,
      });

    const myComplaints =
      await Complaint.countDocuments({
        resident: resident._id,
      });

    const openComplaints =
      await Complaint.countDocuments({
        resident: resident._id,
        status: {
          $in: [
            "Open",
            "Assigned",
            "In Progress",
          ],
        },
      });

    const myVisitors =
      await Visitor.countDocuments({
        resident: resident._id,
      });

    const myBookings =
      await EventBooking.countDocuments({
        resident: resident._id,
      });

    const recentNotices =
      await Notice.find({
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,

      role: "resident",

      stats: {
        myComplaints,
        openComplaints,
        myVisitors,
        myBookings,
      },

      recentNotices,
    });
  }

  if (req.user.role === "maintenance") {

    const assignedComplaints =
      await Complaint.countDocuments({
        assignedTo: req.user._id,
      });

    const inProgressComplaints =
      await Complaint.countDocuments({
        assignedTo: req.user._id,
        status: "In Progress",
      });

    const resolvedComplaints =
      await Complaint.countDocuments({
        assignedTo: req.user._id,
        status: {
          $in: [
            "Resolved",
            "Closed",
          ],
        },
      });

    const recentComplaints =
      await Complaint.find({
        assignedTo: req.user._id,
      })
      .populate({
        path: "resident",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,

      role: "maintenance",

      stats: {
        assignedComplaints,
        inProgressComplaints,
        resolvedComplaints,
      },

      recentComplaints,
    });
  }

  if (req.user.role === "security") {

    const today = new Date();

    today.setHours(
      0, 0, 0, 0
    );

    const todayVisitors =
      await Visitor.countDocuments({
        createdAt: {
          $gte: today,
        },
      });

    const checkedInVisitors =
      await Visitor.countDocuments({
        status: "Checked In",
      });

    const checkedOutVisitors =
      await Visitor.countDocuments({
        status: "Checked Out",
      });

    const recentVisitors =
      await Visitor.find()
        .populate(
          "flat",
          "flatNumber"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    return res.status(200).json({
      success: true,

      role: "security",

      stats: {
        todayVisitors,
        checkedInVisitors,
        checkedOutVisitors,
      },

      recentVisitors,
    });
  }

  if (req.user.role === "admin") {

    try {
      const totalResidents =
        await Resident.countDocuments();

      const totalFlats =
        await Flat.countDocuments();

      const occupiedFlats =
        await Flat.countDocuments({
          status: "Occupied",
        });

      const vacantFlats =
        await Flat.countDocuments({
          status: "Vacant",
        });

      const openComplaints =
        await Complaint.countDocuments({
          status: {
            $in: [
              "Open",
              "Assigned",
              "In Progress",
            ],
          },
        });

      const resolvedComplaints =
        await Complaint.countDocuments({
          status: {
            $in: ["Resolved", "Closed"],
          },
        });

      const pendingVisitors =
        await Visitor.countDocuments({
          status: "Pending",
        });

      const checkedInVisitors =
        await Visitor.countDocuments({
          status: "Checked In",
        });

      const activeNotices =
        await Notice.countDocuments({
          isActive: true,
        });

      const occupancyRate = totalFlats > 0 ? ((occupiedFlats / totalFlats) * 100).toFixed(2): 0;

      const recentComplaints =
        await Complaint.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate({
            path: "resident",
            populate: {
            path: "user",
            select: "name",
            },
          });

      res.status(200).json({
        success: true,

        role: "admin",

        stats: {
          totalResidents,
          totalFlats,
          occupiedFlats,
          vacantFlats,

          openComplaints,
          resolvedComplaints,

          pendingVisitors,
          checkedInVisitors,

          activeNotices,
          occupancyRate: `${occupancyRate}%`,
        },

        recentComplaints,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

module.exports = {
  getDashboardStats,
};