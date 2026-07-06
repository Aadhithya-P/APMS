const Visitor = require("../models/Visitor");
const Resident = require("../models/Resident");
const Flat = require("../models/Flat");
const {
  getIO,
  onlineUsers,
} = require("../socket");

const createVisitor = async (req, res) => {
  try {
    const {
      flatId,
      visitorName,
      phone,
      purpose,
      visitDate,
    } = req.body;

    const flat = await Flat.findById(
      flatId
    );

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    if (!flat.resident) {
      return res.status(400).json({
        success: false,
        message:
          "No resident assigned to this flat",
      });
    }

    const visitor = await Visitor.create({
      resident: flat.resident,
      flat: flat._id,
      visitorName,
      phone,
      purpose,
      visitDate,
      status: "Pending",
    });

    const resident = await Resident.findById(
      flat.resident
    );

    const residentUserId =
      resident.user.toString();

    const socketId =
      onlineUsers[residentUserId];

    if (socketId) {

      getIO().to(socketId).emit(
        "visitor-request",
        {
          visitorId: visitor._id,
          visitorName,
          purpose,
          visitDate,
          message: `${visitorName} is waiting for your approval.`,
        }
      );

      console.log(
        `Notification sent to ${residentUserId}`
      );

    } else {

      console.log(
        "Resident is offline"
      );

    }

    res.status(201).json({
      success: true,
      visitor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyVisitors = async (req, res) => {
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

    const visitors = await Visitor.find({
      resident: resident._id,
    })
      .populate("flat", "flatNumber block")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate({
        path: "resident",
        populate: {
          path: "user",
          select: "name email phone",
        },
      })
      .populate("flat", "flatNumber block")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Visitor must be approved before check-in",
      });
    }

    visitor.status = "Checked In";
    visitor.checkInTime = new Date();

    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor checked in successfully",
      visitor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Checked In") {
      return res.status(400).json({
        success: false,
        message: "Visitor must be checked in before check-out",
      });
    }
    
    visitor.status = "Checked Out";
    visitor.checkOutTime = new Date();

    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor checked out successfully",
      visitor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveRejectVisitor = async (req, res) => {
  try {

    const { status } = req.body;

    if (
      status !== "Approved" &&
      status !== "Rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid visitor status",
      });
    }

    const resident = await Resident.findOne({
      user: req.user._id,
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident profile not found",
      });
    }

    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (
      visitor.resident.toString() !==
      resident._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to respond to this visitor",
      });
    }

    if (
      visitor.status !== "Pending"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This visitor has already been processed",
      });
    }

    visitor.status = status;

    await visitor.save();

    res.status(200).json({
      success: true,
      message: `Visitor ${status.toLowerCase()} successfully`,
      visitor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const deleteVisitor = async (req, res) => {
  try {

    const visitor =
      await Visitor.findByIdAndDelete(
        req.params.id
      );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Visitor deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  checkInVisitor,
  checkOutVisitor,
  approveRejectVisitor,
  deleteVisitor,
};