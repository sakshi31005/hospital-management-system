const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      default: "",
    },

    patientName: {
      type: String,
      required: true,
    },

    doctorId: {
      type: String,
      default: "",
    },

    doctorName: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;