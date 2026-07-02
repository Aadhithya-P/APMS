const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    flatNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    block: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Vacant", "Occupied", "Under Maintenance"],
      default: "Vacant",
    },

    resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    default: null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Flat", flatSchema);