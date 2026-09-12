const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
    },

    doctorName: {
      type: String,
      required: true,
    },

    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;