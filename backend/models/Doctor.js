const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
     {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    specialization: {
      type: String,
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      default: "active"
    },
  },
  {
    timestamps: true
  }
);
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;