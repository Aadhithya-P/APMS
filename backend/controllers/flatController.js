const Flat = require("../models/Flat");
const Resident = require("../models/Resident");

const createFlat = async (req, res) => {
  try {
    const {
      flatNumber,
      block,
      floor,
      status,
    } = req.body;

    const existingFlat = await Flat.findOne({
      flatNumber,
    });

    if (existingFlat) {
      return res.status(400).json({
        success: false,
        message: "Flat already exists",
      });
    }

    const flat = await Flat.create({
      flatNumber,
      block,
      floor,
      status,
    });

    res.status(201).json({
      success: true,
      flat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFlats = async (req, res) => {
  try {
    const flats = await Flat.find()
    .populate({
        path: "resident",
        populate: {
            path: "user",
            select: "name email phone"
        }
    });

    res.status(200).json({
      success: true,
      count: flats.length,
      flats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    res.status(200).json({
      success: true,
      flat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    res.status(200).json({
      success: true,
      flat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndDelete(
      req.params.id
    );

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Flat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const assignResidentToFlat = async (req, res) => {
  try {
    const { residentId } = req.body;

    const flat = await Flat.findById(req.params.flatId);

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    const resident = await Resident.findById(residentId);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    if (flat.resident) {
      return res.status(400).json({
        success: false,
        message: "Flat already has a resident assigned",
      });
    }

    flat.resident = residentId;
    flat.status = "Occupied";

    await flat.save();

    const updatedFlat = await Flat.findById(flat._id)
      .populate({
        path: "resident",
        populate: {
          path: "user",
          select: "name email phone",
        },
      });

    res.status(200).json({
      success: true,
      message: "Resident assigned successfully",
      flat: updatedFlat,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeResidentFromFlat = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.flatId);

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    flat.resident = null;
    flat.status = "Vacant";

    await flat.save();

    res.status(200).json({
      success: true,
      message: "Resident removed successfully",
      flat,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFlat,
  getFlats,
  getFlatById,
  updateFlat,
  deleteFlat,
  assignResidentToFlat,
  removeResidentFromFlat,
};