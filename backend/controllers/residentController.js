const Resident = require("../models/Resident");
const User = require("../models/User");
const Flat = require("../models/Flat");


// Create Resident
const createResident = async (req, res) => {
  try {
    const {
      userId,
      flatNumber,
      block,
      occupancyType,
      emergencyContact,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "resident") {
      return res.status(400).json({
        success: false,
        message: "Only users with resident role can be added as residents",
      });
    }

    const existingResident = await Resident.findOne({
      user: userId,
    });

    if (existingResident) {
      return res.status(400).json({
        success: false,
        message: "Resident already exists",
      });
    }

    const flat = await Flat.findOne({
      flatNumber,
      block,
    });

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    if (flat.resident) {
      return res.status(400).json({
        success: false,
        message: "Flat is already occupied",
      });
    }

    const resident = await Resident.create({
      user: userId,
      flatNumber,
      block,
      occupancyType,
      emergencyContact,
    });

    flat.resident = resident._id;
    flat.status = "Occupied";

    await flat.save();

    const populatedResident = await Resident.findById(
      resident._id
    ).populate("user", "name email phone role");

    res.status(201).json({
      success: true,
      resident: populatedResident,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Residents
const getResidents = async (req, res) => {
  try {
    const residents = await Resident.find()
      .populate("user", "name email phone role");

    res.status(200).json({
      success: true,
      count: residents.length,
      residents,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Resident By ID
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("user", "name email phone role");

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    res.status(200).json({
      success: true,
      resident,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Resident
const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email phone role");

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    res.status(200).json({
      success: true,
      resident,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Resident
const deleteResident = async (req, res) => {
  try {
    const resident = await Resident.findById(
      req.params.id
    );

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    const flat = await Flat.findOne({
      resident: resident._id,
    });

    if (flat) {
      flat.resident = null;
      flat.status = "Vacant";

      await flat.save();
    }

    await Resident.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Resident deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
};