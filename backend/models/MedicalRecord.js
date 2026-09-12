const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
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
      required: true,
    },

    doctorName: {
      type: String,
      required: true,
    },

    diagnosis: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    vitals: {
      bp: {
        type: String,
        default: "",
      },

      temp: {
        type: String,
        default: "",
      },

      pulse: {
        type: String,
        default: "",
      },
    },

    recordDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);

module.exports = MedicalRecord;