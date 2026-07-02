const Facility = require("../models/Facility");

// Create Facility
const createFacility = async (req, res) => {
  try {

    const facility = await Facility.create(
      req.body
    );

    res.status(201).json({
      success: true,
      facility,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Facilities
const getFacilities = async (req, res) => {
  try {

    const facilities =
      await Facility.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: facilities.length,
      facilities,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Facility
const updateFacility = async (req, res) => {
  try {

    const facility =
      await Facility.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    res.status(200).json({
      success: true,
      facility,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Facility
const deleteFacility = async (req, res) => {
  try {

    const facility =
      await Facility.findByIdAndDelete(
        req.params.id
      );

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Facility deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFacility,
  getFacilities,
  updateFacility,
  deleteFacility,
};