const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },

    ward: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },

    patientId: {
      type: String,
      default: "",
    },

    patientName: {
      type: String,
      default: "",
    },

    dailyRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Bed = mongoose.model("Bed", bedSchema);

module.exports = Bed;