const Complaint = require("../models/Complaint");
const Resident = require("../models/Resident");
const Flat = require("../models/Flat");
const User = require("../models/User");

const createComplaint = async (req, res) => {
  try {
    const { category, description, priority } = req.body;

    const resident = await Resident.findOne({
      user: req.user._id,
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident profile not found",
      });
    }

    const flat = await Flat.findOne({
      resident: resident._id,
    });

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "No flat assigned to resident",
      });
    }

    const complaint = await Complaint.create({
      resident: resident._id,
      flat: flat._id,
      category,
      description,
      priority,
    });

    res.status(201).json({
      success: true,
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const resident = await Resident.findOne({
      user: req.user._id,
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident profile not found",
      });
    }

    const complaints = await Complaint.find({
      resident: resident._id,
    })
      .populate("flat", "flatNumber block")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllComplaints = async (req, res) => {
  if (req.user.role === "maintenance") {

    const complaints = await Complaint.find({
      assignedTo: req.user._id,
    })
      .populate({
        path: "resident",
        populate: {
          path: "user",
          select: "name email phone",
        },
      })
      .populate("flat", "flatNumber block")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  }
  try {
    const complaints = await Complaint.find()
      .populate({
        path: "resident",
        populate: {
          path: "user",
          select: "name email phone",
        },
      })
      .populate("flat", "flatNumber block")
      .populate(
        "assignedTo",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate({
        path: "resident",
        populate: {
          path: "user",
          select: "name email phone",
        },
      })
      .populate("flat", "flatNumber block")
      .populate(
        "assignedTo",
        "name email"
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const assignComplaint = async (req, res) => {
  try {
    const { maintenanceUserId } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const maintenanceUser = await User.findById(
      maintenanceUserId
    );

    if (!maintenanceUser) {
      return res.status(404).json({
        success: false,
        message: "Maintenance user not found",
      });
    }

    if (maintenanceUser.role !== "maintenance") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not maintenance staff",
      });
    }

    complaint.assignedTo = maintenanceUserId;
    complaint.status = "Assigned";

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (
      complaint.assignedTo &&
      complaint.assignedTo.toString() !== req.user._id.toString()
    ){
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this complaint",
      });
    }

    const allowedStatuses = [
      "Assigned",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    complaint.status = status;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
};