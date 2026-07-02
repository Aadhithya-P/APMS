const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flatNumber: {
      type: String,
      required: true,
    },

    block: {
      type: String,
      required: true,
    },

    occupancyType: {
      type: String,
      enum: ["Owner", "Tenant"],
      required: true,
    },

    emergencyContact: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resident", residentSchema);