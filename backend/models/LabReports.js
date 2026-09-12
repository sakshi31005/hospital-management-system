const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
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
      default: "",
    },

    testName: {
      type: String,
      required: true,
    },

    testType: {
      type: String,
      default: "",
    },

    result: {
      type: String,
      required: true,
    },

    normalRange: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["normal", "abnormal", "pending"],
      default: "pending",
    },

    reportDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const LabReport = mongoose.model("LabReport", labReportSchema);

module.exports = LabReport;