const EventBooking = require("../models/EventBooking");

const Facility = require("../models/Facility");

const Resident = require("../models/Resident");


// Create Booking
const createBooking = async (
  req,
  res
) => {
  try {

    const {
      facility,
      eventName,
      bookingDate,
      startTime,
      endTime,
      guestsCount,
    } = req.body;

    const resident =
      await Resident.findOne({
        user: req.user._id,
      });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message:
          "Resident profile not found",
      });
    }

    const facilityExists =
      await Facility.findById(
        facility
      );

    if (!facilityExists) {
      return res.status(404).json({
        success: false,
        message:
          "Facility not found",
      });
    }

    const approvedBookings =
        await EventBooking.find({
            facility,
            bookingDate,
            status: "Approved",
        });

        const newStart =
        startTime.replace(":", "");

        const newEnd =
        endTime.replace(":", "");

        for (const booking of approvedBookings) {

        const existingStart =
            booking.startTime.replace(":", "");

        const existingEnd =
            booking.endTime.replace(":", "");

        const hasConflict =
            newStart < existingEnd &&
            newEnd > existingStart;

        if (hasConflict) {

            return res.status(400).json({
            success: false,
            message:
                "Facility already booked for the selected time slot",
            });
        }
    }

    const booking =
      await EventBooking.create({
        resident: resident._id,
        facility,
        eventName,
        bookingDate,
        startTime,
        endTime,
        guestsCount,
      });

    res.status(201).json({
      success: true,
      booking,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Resident Bookings
const getMyBookings = async (
  req,
  res
) => {
  try {

    const resident =
      await Resident.findOne({
        user: req.user._id,
      });

    const bookings =
      await EventBooking.find({
        resident: resident._id,
      })
      .populate(
        "facility",
        "name bookingFee capacity"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getAllBookings = async (
  req,
  res
) => {
  try {

    const bookings =
      await EventBooking.find()
      .populate({
        path: "resident",
        populate: {
          path: "user",
          select:
            "name email phone",
        },
      })
      .populate(
        "facility",
        "name bookingFee capacity"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveBooking = async (
  req,
  res
) => {
  try {

    const booking =
      await EventBooking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    booking.status =
      "Approved";

    booking.approvedBy =
      req.user._id;

    await booking.save();

    res.status(200).json({
      success: true,
      message:
        "Booking approved",
      booking,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectBooking = async (
  req,
  res
) => {
  try {

    const booking =
      await EventBooking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    booking.status =
      "Rejected";

    booking.approvedBy =
      req.user._id;

    await booking.save();

    res.status(200).json({
      success: true,
      message:
        "Booking rejected",
      booking,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBooking = async (
  req,
  res
) => {
  try {

    const booking =
      await EventBooking.findByIdAndDelete(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Booking deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateBooking = async (
  req,
  res
) => {
  try {

    const booking =
      await EventBooking.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Booking updated successfully",
      booking,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  deleteBooking,
  updateBooking,
};